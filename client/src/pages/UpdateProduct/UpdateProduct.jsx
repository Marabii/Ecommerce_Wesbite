import React from "react";
import "./UpdateProduct.css"

import AccessDenied from "../AccessDenied/AccessDenied";

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext} from "react"
import axios from "axios";
import {isLoggedInContext} from "../../App"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { X } from "lucide-react"

import fitGuide from "/measurementsGuide.png"

export default function UpdateProduct() {
    const productID = useParams().id
    const [productData, setProductData] = useState(null)
    const [showFitGuide, setShowFitGuide] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [formData, setFormData] = useState({productPrice : "", productName : "", productDescription : "", promo : "", itemsRemaining: ""})
    const { isLoggedIn } = useContext(isLoggedInContext)
    const imagesData = new FormData()
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER

    useEffect(() => {
        const getProductData = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/product/query?id=${productID}`)
                setProductData(response.data)
            }
            catch (err) {
                console.error(err)
            }
        }
        getProductData()
        
    }, []);

    useEffect(() => {
        const verifyUser = async () => {
          const response = await axios.get(`${serverURL}/api/verifyUser`, {withCredentials : true})
          setIsAdmin(response.data.isAdmin)
        }
        verifyUser()
    }, [])

    const saveChanges = async () => {
        try {
            await axios.post(`${serverURL}/api/editProduct/query?id=${productID}`, {...formData, productID : productID}, {withCredentials : true})
        } catch(e) {
            console.log(e)
        }
    }

    const handleImageUpload = async (event, imageName) => {
        imageName 
            ?
        imagesData.append(imageName, event.target.files[0])
            :
        imagesData.append(`${Date.now()}.png`, event.target.files[0])
        await axios.post(`${serverURL}/api/uploadProductImages/query?id=${productID}`, imagesData, {withCredentials : true})
        window.location.reload(true)
    }

    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }
    
    if (!productData) {
        return <div>Loading...</div>
    }

    const oldPrice = productData.price * (1 + productData.promo / 100)

    if ( !isAdmin || !isLoggedIn ) {
        return <AccessDenied />
    }
      
    return (
        <>
            <div className="update-product-page-container" style={{display : showFitGuide ? "none" : "block"}}>
                <div className="update-product-page-content">
                    <div className="update-product-page-sidebar">
                        {productData.allImages.map((imageName, index) => {
                            return (
                                <LazyLoadImage effect="black-and-white" key={index} src={`${serverURL}/${productData.nameInDirectory}/productImages/${imageName}`} alt={imageName} />
                            )
                        })}
                    </div>
                    <div className="update-product-page-showroom">
                        {productData.allImages.map((imageName, index) => {
                            return (
                                <>
                                    <LazyLoadImage effect="black-and-white" style={{cursor : "pointer"}} key={index} src={`${serverURL}/${productData.nameInDirectory}/productImages/${imageName}`} loading="lazy" alt={imageName} onClick={() => {document.getElementById(`fileInput-${index}`).click()}} />
                                    <input
                                        type="file"
                                        id={`fileInput-${index}`}
                                        style={{ display: 'none' }}
                                        onChange={(e) => {handleImageUpload(e, imageName)}}
                                    />
                                </>
                            )
                        })}
                        <div>
                            <button className="shop-button" onClick={() => document.getElementById('getFile').click()}>Add Image</button>
                            <input type='file' id="getFile" style={{display : "none"}} onChange={(e) => {handleImageUpload(e, "")}}/>
                        </div>
                    </div>
                    <div className = "update-product-page-description">
                        <h2><input type="text" defaultValue={productData.name} name="productName" onChange={(e) => handleChange(e)} /></h2>
                        <div>
                            <div>$<input style={{width : "100px"}} type="number" min={0} defaultValue={productData.price} name="productPrice" onChange={(e) => handleChange(e)}/></div>
                            {productData.promo !== 0 && <div>${oldPrice}</div>}
                        </div>
                        <hr />
                        <p><textarea id="update-product-page-product-description" name = "productDescription" onChange={(e) => handleChange(e)} type="text" defaultValue={productData.description}/></p>
                        <button className="fit-guide-btn" onClick={() => setShowFitGuide(true)}>Fit Guide</button>
                        <div className="update-product-properties">
                            <div style={{all : "unset"}}>
                                <h5>Promo</h5>
                                <input type="number" min={0} max={100} id="promoUpdateProduct" name="promo" defaultValue={productData.promo} onChange={(e) => handleChange(e)} />
                            </div>
                            <div style={{all : "unset"}}>
                                <h5>Items Remaining</h5>
                                <input type="number" min={0} id="items-remaining" name="itemsRemaining" defaultValue={productData.itemsRemaining} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <button className="add-to-cart-btn shop-button" onClick={() => {saveChanges(); window.location.reload(true)}}>SAVE CHANGES</button>
                        <button className="add-to-cart-btn shop-button" onClick={() => window.location.reload(true)}>CANCEL CHANGES</button>
                    </div>
                </div>
            </div>
            <div style={{display : showFitGuide ? "grid" : "none"}} className="fit-guide-container">
                <X onClick={() => setShowFitGuide(false)} id = "close-fit-guide" stroke = "grey"/>
                <img src = {fitGuide} alt="fit guide" />
            </div>
        </>
    )
}