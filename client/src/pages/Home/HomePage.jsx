import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./HomePage.css"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import utilitiesForHome from "./utilitiesHome";
import { useNavigate } from "react-router-dom"

import landingPageImage from "/landingpageimage.png"

import Header from "../../components/Header/Header";
import ProductFunc from "../../utils/productComponent/productComponent";
import Footer from "../../components/Footer/Footer";

export default function HomePage() {

    const responsive = utilitiesForHome.responsive
    const shopTourImages = utilitiesForHome.shopTourImages
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const navigate = useNavigate()
    const [productsData, setProductsData] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/productsData/query?category=all`)
                setProductsData(response.data)
            } catch (e) {
                console.error(e)
            }
        }
        getData()
    }, [])

    const navigateToCategory = (categoryName) => {
        navigate(`/collection/${categoryName}`)
    }

    if (!productsData) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Header />
            <div className="home-page-image-container">
                <img src= {landingPageImage} alt="landingPageImage"/>
                <div>
                    <h2>CHINOS RESTOCK IN 7 COLORS</h2>
                    <button className="shop-button" onClick={() => navigateToCategory("all")}>SHOP NOW</button>
                </div>
            </div>
            <div className="home-page-flash-sales">
                <h2>FLASH SALES DEALS</h2>
                <h4>ACT QUICK, LIMITED QUANTITIES AVAILABLE</h4>
            </div>
            <div className="home-page-deals">
                <Carousel responsive={responsive}>
                    {productsData.map(product => {
                        return (
                            <div key={product._id}>
                                <ProductFunc productData = {product}/>
                            </div>
                        )
                    })}
                </Carousel>
                <button>VIEW ALL DEALS</button>
            </div>
            <div className="home-page-shop-tour">
                {shopTourImages.map((category, index) => {
                    return (
                        <div key={index} className="home-page-shop-tour-image-div">
                            <img src = {category.img}></img>
                            <div>
                                <h3>{category.name}</h3>
                                <button className="shop-button" onClick = {() => navigateToCategory(category.name)}>VIEW {category.name}</button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Footer />
        </>
    )
}