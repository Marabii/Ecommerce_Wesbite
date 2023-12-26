import React, { useEffect, useState, useContext } from "react";
import "./AdminPanel.css"

import { Boxes, ShoppingCart, BadgeDollarSign, Star, Home } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {isLoggedInContext} from "../../App"

import AccessDenied from "../AccessDenied/AccessDenied.jsx";
import ProductFunc from "../../utils/productComponent/productComponent";
import AddProduct from "../../utils/AddProduct/AddProduct";
import useWindowDimensions from "../../utils/WindowSize";

export default function AdminPanel() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState("products")
    const [productsData, setProductData] = useState([])
    const [categorizedData, setCategorizedData] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [customersData, setCustumersData] = useState([])
    const [showAddProductByCategory, setShowAddProductByCategory] = useState({});
    const { isLoggedIn } = useContext(isLoggedInContext)
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const { width } = useWindowDimensions()

    useEffect(() => {
        const verifyUser = async () => {
          const response = await axios.get(`${serverURL}/api/verifyUser`, {withCredentials : true})
          setIsAdmin(response.data.isAdmin)
        }
        verifyUser()
    }, [])

    useEffect(() => {
        if (productsData.length !== 0) {
            const updatedCategorizedObjects = {};
            productsData.forEach(obj => {
                const category = obj.category;
    
                if (!updatedCategorizedObjects[category]) {
                    updatedCategorizedObjects[category] = [];
                }
    
                updatedCategorizedObjects[category].push(obj);
                });
    
            setCategorizedData(updatedCategorizedObjects);
        }
    }, [productsData]);

    useEffect(() => {
        const getProductData = async () => {
            const response = await axios.get(`${serverURL}/api/productsData/query?category=all`)
            setProductData(response.data)
        }
        getProductData()
    }, [])

    useEffect(() => {
        const getCustomers = async () => {
            const result = await axios.get(`${serverURL}/api/getcustomers`, {withCredentials : true})
            setCustumersData(result.data)
        }

        if (isAdmin && currentPage === "orders") {
            getCustomers()
        }
    }, [currentPage])

    const handleShowAddProduct = (category, showCondition) => {
        setShowAddProductByCategory((prev) => ({
          ...prev,
          [category]: showCondition,
        }));
    };

    const findProductById = (id) => {
        for (let i = 0; i < productsData.length; i++) {
            if (productsData[i]._id === id) {
                return productsData[i]
            }
        }
    }

    const resolveOrder = async (index, userID) => {
        const confirmation = window.confirm("Are you sure you want to resolve this order?");
        
        if (confirmation) {
            const response = await axios.post(`${serverURL}/api/resolve-order`, { index: index, userID: userID }, { withCredentials: true });
            window.location.reload(true);
        }
    };
      

    if ( !isAdmin || !isLoggedIn ) {
        return <AccessDenied />
    }

    if (width < 1100) {
        return (
            <div className="computer-access-only">
                <div className="content">
                <h1>Oops!</h1>
                <p>
                    Sorry, you can only access this page from a computer. Please switch to a computer to view this content.
                </p>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-panel-conatainer">
            <div className="admin-panel-sidebar">
                <ul>
                    <li onClick={() => setCurrentPage("products")} style={{backgroundColor : currentPage === "products" ? "#c1c8c9" : "white"}}>
                        <Boxes />
                        <label>Products</label>
                    </li>
                    <li onClick={() => setCurrentPage("orders")} style={{backgroundColor : currentPage === "orders" ? "#c1c8c9" : "white"}}>
                        <ShoppingCart />
                        <label>Orders</label>
                    </li>
                    <li onClick={() => setCurrentPage("transactions")} style={{backgroundColor : currentPage === "transactions" ? "#c1c8c9" : "white"}}>
                        <BadgeDollarSign />
                        <label>Transactions</label>
                    </li>
                    <li onClick={() => setCurrentPage("reviews")} style={{backgroundColor : currentPage === "reviews" ? "#c1c8c9" : "white"}}>
                        <Star />
                        <label>Reviews</label>
                    </li>
                    <li onClick={() => navigate("/")}>
                        <Home />
                        <label>Home</label>
                    </li>
                </ul>
            </div>
            <div className="admin-panel-main">
                {
                    currentPage === "products"
                                &&
                    <>
                        {
                            Object.keys(categorizedData).map((category, index) => {
                                return (
                                    <>
                                        <h2>{category === "suit" ? `suits` : `${category}`}</h2>
                                        <button className="admin-panel shop-button" onClick={() => handleShowAddProduct(category, true)}>ADD PRODUCT</button>
                                        {showAddProductByCategory[category] && <AddProduct category = {category} handleShowAddProduct = {handleShowAddProduct} />}
                                        <div>
                                            {categorizedData[category].map(product => {
                                                return <ProductFunc productData = {product} />
                                            })}
                                        </div>
                                    </>
                                )
                            })
                        }
                    </>
                }

                {
                    currentPage === "orders"
                                &&
                    (customersData.length !== 0
                                ?
                            <table>
                            <tbody>
                                <tr className="titles-table">
                                <th>Email</th>
                                <th>Products</th>
                                <th>Resolve Orders</th>
                                <th>Ordered At</th>
                                <th>Prices</th>
                                </tr>
                                {customersData && customersData.map((user, userIndex) => {
                                return user.orders.map((order, orderIndex) => (
                                    <tr key={`${userIndex}-${orderIndex}`}>
                                    <td>{user.email}</td>
                                    <td>
                                        {order.items.map(item => {
                                        const product = findProductById(item);
                                        return (
                                            <div key={item}>{product.name}</div>
                                        );
                                        })}
                                    </td>
                                    <td>
                                        <button
                                        className="resolve-order"
                                        disabled={order.resolved}
                                        onClick={() => resolveOrder(orderIndex, user._id)}
                                        >
                                        {order.resolved ? <>Order Resolved</> : <>Resolve Order</>}
                                        </button>
                                    </td>
                                    <td>{order.createdAt}</td>
                                    <td>
                                        {order.items.map(item => {
                                        const product = findProductById(item);
                                        return (
                                            <div key={item}>{product.price}</div>
                                        );
                                        })}
                                    </td>
                                    </tr>
                                ));
                                })}
                            </tbody>
                            </table>

                        :
                    <h2 className="nonewproducts">
                        No new Orders
                    </h2>)
                }

                {
                    currentPage === "transactions"
                                &&
                    <h1 style={{position : "absolute", left : "50%"}}>Coming Soon</h1>
                }

                {
                    currentPage === "reviews"
                                &&
                    <h1 style={{position : "absolute", left : "50%"}}>Coming Soon</h1>
                }
            </div>
        </div>
    )
}