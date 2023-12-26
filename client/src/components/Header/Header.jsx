import React, { useEffect } from "react";
import "./Header.css"
import { useState, useContext } from "react";

import useWindowDimensions from "../../utils/WindowSize";
import ShopMenuHeader from "../../utils/ShopMenuHeader/ShopMenuHeader";
import Cart from "../../utils/Cart/Cart";
import axios from "axios"
import {isLoggedInContext} from "../../App"

import ecommerceLogo from "../../assets/ecommerce-logo.png"
import {AlignJustify, ShoppingCart, X} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion";


export default function Header(props) {
    const [showShopMenu, setShowShopMenu] = useState(false)
    const [showCart, setShowCart] = useState(false)
    const [cartProducts, setCartProducts] = useState([])
    const { width } = useWindowDimensions()
    const { isLoggedIn, isAdmin } = useContext(isLoggedInContext)
    const numberOfCartProducts = cartProducts.length
    const location = useLocation();
    const [isCollectionPage, setIsCollectionPage] = useState(false);
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    
    const handleScroll = () => {
        const bottomHeader = document.querySelector('.bottom-header');
        const topHeader = document.querySelector('.top-header');
    
        if (window.scrollY > topHeader.offsetHeight) {
          bottomHeader.classList.add('fixed-header');
        } else {
          bottomHeader.classList.remove('fixed-header');
        }
    };

    const handleShowCart = () => {
        setShowCart(true)
    }

    useEffect(() => {
        setIsCollectionPage(location.pathname.includes("collection"));
      }, [location]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchCartProducts = async () => {
            const response = await axios.get(`${serverURL}/api/getCartProducts`, {withCredentials : true})
            const { cartProducts } = response.data
            setCartProducts(cartProducts)
        }
        isLoggedIn && fetchCartProducts()
    }, [isLoggedIn])

    useEffect(() => {

    })
    
    return (
        <>
            <header>
                <div className="top-header">
                    <div className="ecommerce-site-name">COMBATANT GENTLEMEN</div>
                    <h3>FREE SHIPPING ON ALL ORDERS OVER $100</h3>
                </div>
                <div className="bottom-header">
                    <div>
                        { 
                            width < 900 
                                ? 
                            <AlignJustify onClick = {() => {setShowShopMenu(true)}} />
                                :    
                            <ul>
                                <li onClick={() => setShowShopMenu(true)}>SHOP</li>
                            </ul>
                        }

                        <img src={ecommerceLogo} alt="ecommerce-logo" />

                        { 
                            width < 1100 
                                ? 
                            <div style={{position : "relative"}} onClick={handleShowCart}>
                                <ShoppingCart  />
                                <div className="cart-number-of-products">{numberOfCartProducts}</div>
                            </div>
                                : 
                            <ul>
                                <Link style={{all : "unset"}} to = "/login"><li>ACCOUNT</li></Link>
                                <li onClick={handleShowCart}>CART ({numberOfCartProducts})</li>
                                {isAdmin && <Link style={{all : "unset"}} to = "/admin-panel-rekjherh651"><li>ADMIN PANEL</li></Link>}
                            </ul>
                        }
                    </div>
                    <div className="collection-page-sort" style={{display : isCollectionPage ? "block" : "none"}}>
                        <button>SORT</button>
                    </div>
                </div>
            </header>

              <AnimatePresence>
                { 
                    showShopMenu
                        &&
                    <ShopMenuHeader setShowShopMenu = {setShowShopMenu} />
                }
                </AnimatePresence>


            {
                showCart
                   &&
                <Cart cartProducts = { cartProducts } setShowCart = {setShowCart} />
            }
        </>
    )
}