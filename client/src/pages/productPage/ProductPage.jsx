import React from "react";
import "./ProductPage.css"
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext} from "react"
import axios from "axios";
import {isLoggedInContext} from "../../App"
import { LazyLoadImage } from 'react-lazy-load-image-component';

import fitGuide from "/measurementsGuide.png"
import { X } from "lucide-react"

export default function ProductPage() {
    const productID = useParams().id
    const [productData, setProductData] = useState(null)
    const [showFitGuide, setShowFitGuide] = useState(false)
    const [cartProducts, setCartProducts] = useState([])
    const { isLoggedIn } = useContext(isLoggedInContext)
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

    const HeaderComponent = React.memo(
        () => <Header />,
        (prevProps, nextProps) =>   
        prevProps.cartProducts === nextProps.cartProducts
    );

    if (!productData) {
        return <div>Loading...</div>
    }

    const oldPrice = productData.price * (1 + productData.promo / 100)

    const handleAddToCart = async () => {
        if (isLoggedIn) {
          try {
            setCartProducts((prev) => {
              if (!prev) {
                return [productID];
              }
              if (!prev.includes(productData?._id)) {
                return [...prev, productID];
              }
              return prev;
            });
            await axios.post(`${serverURL}/api/postCartProducts`, {productID : productID}, {withCredentials : true})
          } catch (error) {
            console.log(error);
            // handle the error here
          }
        } else {
          alert("Please Log In Before Adding Items To Cart");
        }
    };

    const scrollToImage = (index) => {
        const imageElement = document.getElementById(`product-image-${index}`);
        if (imageElement) {
          imageElement.scrollIntoView({ behavior: "smooth" });
        }
    };
      
    return (
        <>
            <div className="product-page-container" style={{display : showFitGuide ? "none" : "block"}}>
                <HeaderComponent />
                <div className="product-page-content">
                    <div className="product-page-sidebar">
                        {productData.allImages.map((imageName, index) => {
                            return (
                                <LazyLoadImage effect="black-and-white" key={index} src={`${serverURL}/${productData.nameInDirectory}/productImages/${imageName}`} alt={imageName} onClick={() => scrollToImage(index)}/>
                            )
                        })}
                    </div>
                    <div className="product-page-showroom">
                        {productData.allImages.map((imageName, index) => {
                            return (
                                <div id={`product-image-${index}`}><LazyLoadImage effect="black-and-white" key={index} src={`${serverURL}/${productData.nameInDirectory}/productImages/${imageName}`} loading="lazy" alt={imageName} /></div>
                            )
                        })}
                    </div>
                    <div className = "product-page-description">
                        <h2>{productData.name}</h2>
                        <div>
                            <div>${productData.price}</div>
                            {productData.promo !== 0 && <div>${oldPrice}</div>}
                        </div>
                        <hr />
                        <p>{productData.description}</p>
                        <button className="fit-guide-btn" onClick={() => setShowFitGuide(true)}>Fit Guide</button>
                        <button className="add-to-cart-btn shop-button" onClick={handleAddToCart}>ADD TO CART</button>
                    </div>
                </div>
                <Footer />
            </div>
            <div style={{display : showFitGuide ? "grid" : "none"}} className="fit-guide-container">
                <X onClick={() => setShowFitGuide(false)} id = "close-fit-guide" stroke = "grey"/>
                <img src = {fitGuide} alt="fit guide" />
            </div>
        </>
    )
}