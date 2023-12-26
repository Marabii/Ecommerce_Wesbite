import React from "react";
import "./ShopMenuHeader.css"

import { Facebook, Instagram, Twitter, X } from "lucide-react";
import { motion } from "framer-motion"

export default function ShopMenuHeader(props) {
    const {setShowShopMenu} = props
    
    const handleClick = (collectionName) => {
        window.location.replace(`/collection/${collectionName}`)
    }

    return (
        <motion.div className="shop-menu-header" initial = {{left : "-600px"}} exit={{left : "-600px"}} animate = {{left : 0}} transition={{type : "string"}}>
            <X onClick = {() => setShowShopMenu(false)} className="shop-menu-x" />
            <div className="shop-menu-store-items">
                <div>New</div>
                <ul>
                    <li onClick={() => handleClick("sunglasses")}>Sunglasses</li>
                    <li>Last Call</li>
                    <li>WFH</li>
                    <li>Made-To-Order</li>
                    <li>Gents Labs</li>
                    <li>Essential Suits</li>
                    <li>Big & Tall</li>
                </ul>
                <hr />
            </div>

            <div className="shop-menu-store-items">
                <div>TAILORED</div>
                <ul>
                    <li onClick={() => handleClick("suit")}>Suits</li>
                    <li>Tuxedos</li>
                    <li>Dress Pants</li>
                    <li>Blazers</li>
                    <li>Outwear</li>
                </ul>
                <hr />
            </div>

            <div className="shop-menu-store-items">
                <div>TOPS</div>
                <ul>
                    <li onClick={() => handleClick("polos")}>Polo's & T-Shirts</li>
                    <li>Shirts</li>
                    <li>Knits</li>
                </ul>
                <hr />
            </div>

            <div className="shop-menu-store-items">
                <div>BOTTOMS</div>
                <ul>
                    <li onClick={() => handleClick("chinos")}>Chinos</li>
                    <li>Denim</li>
                    <li>Shorts</li>
                </ul>
                <hr />
            </div>

            <div className="shop-menu-store-items">
                <div>Accessories</div>
                <ul>
                    <li onClick={() => handleClick("sunglasses")}>Sunglasses</li>
                    <li>Socks</li>
                    <li>Ties</li>
                    <li>Belts</li>
                    <li>Bowties</li>
                    <li>Luggage</li>
                </ul>
                <hr />
            </div>

            <div className="shop-menu-store-items" style={{marginBottom : "40px"}}>
                <ul>
                    <li>Contact Us</li>
                    <li>Unhemmed</li>
                    <li>Returns and Exchanges</li>
                    <li>Terms and Conditions</li>
                    <li>Privacy</li>
                    <li>Help</li>
                    <li>Account</li>
                    <li>Search</li>
                </ul>
            </div>
            <motion.div initial = {{left : "-600px"}} exit={{left : "-600px"}} animate = {{left : 0}} transition={{type : "string"}} className="shop-menu-social-media">
                <ul>
                    <li><Facebook /></li>
                    <li><Twitter /></li>
                    <li><Instagram /></li>
                </ul>
            </motion.div>
        </motion.div>
    )
}