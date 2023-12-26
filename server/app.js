const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const port = process.env.PORT || 3001
const path = require("path")
const {readdir, existsSync, mkdirSync} = require("fs")
const multer = require("multer")

var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');

const connection = require('./config/database');
const productsData = require("./models/product")
const sessionsData = require("./models/sessions")
const MongoStore = require('connect-mongo')(session);
const { connectDB } = require("./config/productsDataDB")
const User = connection.models.User;
const cookieParser = require("cookie-parser")

const cors = require("cors");
const { isAdmin, isAuth } = require('./routes/authMiddleware');
/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();
app.use(
    cors({
      origin: process.env.FRONT_END,
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
      credentials: true,
    })
  );
connectDB()



// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.END_POINT_SECRET;

let customerID;
let paymentID;
let items;
app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(`error in webhook : ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
        case 'customer.created':
            const customer = event.data.object
            customerID = customer.metadata.userID
            paymentID = customer.metadata.paymentID
            items = JSON.parse(customer.metadata.items).map(item => {
                return item.id
            })
            break;
        case 'checkout.session.completed':
            if (customerID) {
                const orderID = event.data.object.id;
                const newOrder = {
                    paymentID : paymentID,
                    items: items,
                    createdAt: new Date(),
                    resolved: false,
                    properties: []
                };
            
                User.findByIdAndUpdate(customerID, {
                    $push: { orders: newOrder },
                }, { new: true })
                .catch(error => {
                    console.error('Error updating user:', error);
                });
            }
            break;
        
        default:
            console.log(`unhandled event type : ${event.type}`)
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  });
  
app.use(express.json());
app.use(express.urlencoded({extended: true}));



/**
 * -------------- SESSION SETUP ----------------
 */


const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


//------end of passport code------

app.use(express.static(path.join(__dirname, "database", "products", "productsImages")))


app.get("/api/productsData/query", (req, res) => {
    const preFilter = req.query.filter && JSON.parse(req.query.filter)
    const category = req.query.category
    const filter = category === "all" ? {} : {
        category : category,
    }
    preFilter?.color ? filter["properties.colors"] = preFilter.color : null;
    preFilter?.size ? filter["properties.size"] = preFilter.size : null;
    productsData.find(filter)
        .then((data) => {res.json(data)})
        .catch(err => res.json(err))
})

app.get("/api/product/query", (req, res) => {
    productsData.findById(req.query.id)
        .then((data) => {
            const directory = path.join(__dirname, "database", "products", "productsImages", data.nameInDirectory, "productImages")
            readdir(directory, (err, files) => {
                res.json({...data._doc, allImages : files})
            });
        })
        .catch(err => res.json(err)) 
})

app.post("/api/postCartProducts", isAuth, (req, res) => {
    const { productID } = req.body;  // Corrected 'res' to 'req'
    
    User.findById(req.user._id)
        .then((user) => {
            if (user.cartProducts.includes(productID)) {
                console.log("Product is already in the cart.");
                return;
            }
            productID && user.cartProducts.push(productID);
            return user.save();
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

User.find({})
    .then(data => console.log("data: ", data))
    .catch(e => console.error("error in data: ", e))

app.get("/api/getCartProducts", isAuth, (req, res) => {
    User.findById(req.user._id)
        .then((data) => {
            const cartProducts = data.cartProducts
            res.json({cartProducts : cartProducts})
        }).catch(e => console.error(e.message))
})

app.post("/api/removeCartItem", isAuth, async (req, res) => {
    try {
        const userID = req.user._id;
        const productIDToRemove = req.body.productID;
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cartProducts = user.cartProducts.filter(id => id.toString() !== productIDToRemove);

        await user.save();

        res.status(200).json({ message: "Item removed successfully", user });
    } catch (error) {
        console.error("Error removing item:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/verifyUser", cookieParser(process.env.SECRET), (req, res) => {
    const userID = req?.user?._id;
    userID 
    ?
    User.findById(userID)
        .then(data => res.json({isLoggedIn : req.isAuthenticated(), isAdmin : data.admin}))
    :
    res.json({isLoggedIn : req.isAuthenticated(), isAdmin : false})
});

app.post("/api/editProduct/query", isAdmin, (req, res) => {
    const { productID, productPrice, productDescription, productName, promo, itemsRemaining } = req.body;
    const updateFields = {};
    if (productPrice) {
        updateFields.price = productPrice;
    }
    if (productDescription) {
        updateFields.description = productDescription;
    }
    if (productName) {
        updateFields.name = productName;
    }
    if (promo) {
        updateFields.promo = promo
    }
    if (itemsRemaining) {
        updateFields.itemsRemaining = itemsRemaining
    }

    productsData.findByIdAndUpdate(productID, updateFields, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.end()
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.post("/api/uploadProductImages/query", isAdmin, (req, res) => {
    const productID = req.query.id;
    productsData.findById(productID)
        .then(data => {
            const nameInDirectory = data.nameInDirectory
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, `./database/products/productsImages/${nameInDirectory}/productImages`);
                },
                filename: function (req, file, cb) {
                    cb(null, file.fieldname)
                }
            });
        
            const upload = multer({ storage: storage });
        
            upload.any()(req, res, function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Error uploading files' });
                } else {
                    res.json({ message: 'Data received successfully' });
                }
            });
        })
        .catch(e => {
            console.error(e.message)
        })
})

app.post('/api/saveProductData', async (req, res) => {
    const { category, name, description, price, itemsRemaining, promo, nameInDirectory, properties } = req.body;
  
    try {
      const newProduct = new productsData({
        category,
        name,
        description,
        price,
        itemsRemaining,
        promo,
        nameInDirectory,
        properties
      });
  
      // Save the product to the database
      await newProduct.save();
  
      res.status(201).json({ success: true, message: 'Product saved successfully' });
    } catch (error) {
      console.error('Error saving product:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

app.post("/api/saveProductImages/query", isAdmin, (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          // Get the id from the query parameter
          const productId = req.query.id;
      
          // Create the directory path
          const dirPath = `./database/products/productsImages/${productId}/productImages`;
      
          // Create the directory if it doesn't exist
          if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
          }
      
          cb(null, dirPath);
        },
        filename: (req, file, cb) => {
          // Use the original name for the file
          cb(null, file.fieldname);
        },
    });

    const upload = multer({ storage });
    upload.any()(req, res, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error uploading files' });
        } else {
            res.json({ message: 'Data received successfully' });
        }
    });
})

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)



app.post("/api/create-checkout-session", isAuth, async (req, res) => {
    try {
        const products = await productsData.find({});
        const storeItems = new Map(products.map(product => [String(product._id), { priceInCents: Number(product.price) * 100, name: product.name }]));
        const randomString = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).substring(2);
        const customer = await stripe.customers.create({
            metadata:{
                userID : req.session.passport.user,
                items : JSON.stringify(req.body.items),
                paymentID : randomString
            }
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                price_data: {
                    currency: "usd",
                    product_data: {
                    name: storeItem.name,
                    },
                    unit_amount: storeItem.priceInCents,
                },
                quantity: item.quantity,
                }
            }),
            success_url : `${process.env.FRONT_END}/successful-payment/${randomString}`,
            cancel_url: process.env.FRONT_END,
        })
        res.json({ url: session.url })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ error: e.message })
    }
})

app.get("/api/getcustomers", isAdmin, (req, res) => {
    User.find({ orders: { $exists: true, $ne: [] } })
    .then(results => {
        res.json(results)
    })
    .catch(error => {
      console.error('Error:', error);
    });
})

app.post("/api/resolve-order", isAdmin, async (req, res) => {
    try {
        const { index, userID } = req.body;
        // Find the user by ID
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Access the orders array and update the 'resolved' field
        user.orders[index].resolved = true;
        user.markModified('orders');
        // Save the updated user document
        await user.save();

        res.json({ message: 'Order resolved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

let result = false;
app.get("/api/verifyPayment/:id", isAuth, (req, res) => {
    const userID = req?.user?._id;
    const paymentID = req.params.id
    User.findById(userID)
        .then(data => {
            data.orders.forEach(order => {
                console.log(order.paymentID)
                if (order.paymentID === paymentID) {
                    result = true;
                }
            })
            
        }) .catch(e => console.log(e.message))
    res.json({hasPaid : result})
})


app.listen(port);