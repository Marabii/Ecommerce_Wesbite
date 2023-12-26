import React, { useEffect, useState } from "react";
import "./Cart.css";
import { X, XCircle } from "lucide-react"

import axios from "axios"


export default function Cart(props) {
    const { cartProducts, setShowCart } = props
    const [cartProductsData, setCartProductsData] = useState([])
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const totalPrice = cartProductsData.length === 0 ? 0 : cartProductsData.reduce((acc, product) => acc + product.price, 0)
    
    useEffect(() => {
        const getCartProductsData = async () => {
          if (cartProducts.length !== 0) {
            let tempArray = [];
            for (const element of cartProducts) {
              const response = await axios.get(`${serverURL}/api/product/query?id=${element}`);
              tempArray.push(response.data);
            }
            setCartProductsData(tempArray);
          }
        };
        getCartProductsData()
    }, [cartProducts]);
    
    const removeItem = async (product) => {
        const productID = product._id;
        setCartProductsData((prev) => prev.filter(item => item._id !== productID));
        try {
            await axios.post(`${serverURL}/api/removeCartItem`, { productID }, {withCredentials : true});
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };
    
    const handleCheckOut = async () => {
        const items = cartProducts.map(id => {
            return {id : id, quantity : 1}
        })
        try {
            const response = await axios.post(`${serverURL}/api/create-checkout-session`, {items : items}, {withCredentials : true})
            const { url } = response.data
            window.location.replace(url)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className = "cart-component">
            <div className="cart-top">
                <label>CART</label>
                <X onClick={() => setShowCart(false)} style={{cursor : "pointer"}}/>
            </div>
            <hr />
            {
                cartProductsData.length !== 0 
                            &&
                <div className="cart-body">
                    {cartProductsData.map(product => {
                        return (
                            <div key={product._id} style={{marginBottom : "15px"}}>
                                <label>{product.name}</label>
                                <div>
                                    <XCircle stroke="red" size={20} style={{cursor : "pointer"}} onClick={() => {removeItem(product); window.location.reload(true)}}/>
                                    <label>${product.price}</label>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            {totalPrice === 0 ? <div className="empty-cart">Your Cart Is Empty</div> : <div className="cart-foot">Total : ${totalPrice} DHs</div>}
            {cartProductsData.length !== 0 &&<button onClick={handleCheckOut}>CHECK OUT</button>}
        </div>
    )
}