import React from "react"
import "./productComponent.css"

import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import { isLoggedInContext } from "../../App"


export default function ProductFunc(props) {
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const data = props.productData
    const oldPrice = data.price * (1 + data.promo / 100)
    const thumbnailURL = `${serverURL}/${data.nameInDirectory}/productImages/thumbnail.png`
    const hoverImgURL = `${serverURL}/${data.nameInDirectory}/productImages/hover.png`
    const {itemsRemaining} = data 
    const { isAdmin } = useContext(isLoggedInContext)
    const navigate = useNavigate()

    const [isHovering, setIsHovering] = useState(false)

    const handleMouseOver = () => {
        setIsHovering(true)
    }

    const handleMouseOut = () => {
        setIsHovering(false)
    }

    const handleClickOnProduct = () => {
        const previousPage = window.location.href
        if (isAdmin && previousPage.includes("admin-panel")) {
            navigate(`/update-product/${data._id}`)
        } else {
            navigate(`/product/${data._id}`)
        }
    }

    return (
        <div className="product-component">
            <div className="img-container-product" onClick={handleClickOnProduct}>

                {
                    isHovering 
                    ? 
                    <motion.img initial = {{opacity : 0}} animate = {{opacity : 1}} transition={{duration : 0.5}} src={hoverImgURL} alt="hoverImg" onMouseOut={handleMouseOut}></motion.img> 
                    : 
                    <img src={thumbnailURL} alt="thumbnail" onMouseOver={handleMouseOver}></img>
                }
                
                {itemsRemaining <= 5 ? 
                    itemsRemaining === 0 ?
                        <div>SOLD OUT</div>
                            :
                        <div>ONLY {itemsRemaining} ITEMS LEFT</div>
                    :
                    <></>
                }   
            </div>
            <div className="product-data">
                <p>{data.name}</p>
                <div>
                    <p className="current-price">{data.price}</p>
                    {data.promo !== 0 && <p className="old-price">{oldPrice}</p>}
                </div>
            </div>
        </div>
    )
}