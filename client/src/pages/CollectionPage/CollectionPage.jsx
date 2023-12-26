import React from "react";
import "./CollectionPage.css"
import { useEffect, useState, lazy, Suspense } from "react";

import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";

import { useParams } from "react-router-dom";
import axios from "axios";
import spinner from "./CollectionPageUtils";
import { motion } from "framer-motion"

const LazyProductFunc = lazy(() => import("../../utils/productComponent/productComponent"));

export default function CollectionPage() {
    const [productsData, setProductsData] = useState([])
    const [filter, setFilter] = useState({})
    const collectionName = useParams().collectionName
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER

    useEffect(() => {
        const getProductsData = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/productsData/query?category=${collectionName}&filter=${JSON.stringify(filter)}`)
                setProductsData(response.data)
            } catch(e) {
                console.log(e)
            }
        }
        getProductsData()
    }, [filter])

    function processPropertiesArray(objectsArray) {
        var processedProperties = {};
        objectsArray.forEach(obj => {
          if (obj.hasOwnProperty('properties') && typeof obj.properties === 'object') {
            Object.keys(obj.properties).forEach(key => {
              if (!processedProperties.hasOwnProperty(key)) {
                processedProperties[key] = [];
              }
              processedProperties[key] = [...new Set([...processedProperties[key], ...obj.properties[key]])];
            });
          }
        });
      
        return processedProperties;
    }

    function addElement(element, array) {
        if (!array.includes(element)) {
            array.push(element)
        } else {
            return array
        }
    }

    const handleColorFilter = (clr) => {
        setFilter(prev => {
            return {
                ...prev, color : prev.color ? addElement(clr, prev.color) : [clr]
            }
        })
    }

    const handleSizeFilter = (size) => {
        setFilter(prev => {
            return {
                ...prev, size : prev.size ? addElement(size, prev.size) : [size]
            }
        })
    }
      
    const properties = productsData.length !== 0 && processPropertiesArray(productsData)

    return (
        <div className="collection-page">
            <Header />
            <div className="collection-page-main">
                <div className="collection-page-sidebar">
                    <h3>{collectionName === "suit" ? `suits` : `${collectionName}`}</h3>
                    <div className="collection-page-sidebar-filters">
                    {Object.keys(properties).map(property => {
                        if (property === 'colors') {
                            return (
                                <div key={property} className="color-filter">
                                    <h4>Colors</h4>
                                    <div>
                                        {properties[property].map((color, index) => (
                                            <div key={index} onClick={() => handleColorFilter(color)} style={{ backgroundColor: color, width: "20px", height: "20px" }}></div>
                                        ))}
                                    </div>
                                </div>
                            );
                            } else if (property === "size") {
                                return (
                                    <div key={property} className="size-filter">
                                        <h4>Sizes</h4>
                                        <div>
                                            {properties[property].map((size, index) => (
                                                <button key={index} onClick={() => handleSizeFilter(size)}>{size}</button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                        {Object.keys(filter).length !== 0 && <button className="shop-button" onClick={() => setFilter({})}>Reset Filters</button>}
                    </div>
                </div>
                <div className="collection-page-products">
                    <Suspense fallback={spinner}>
                        {productsData.map((product, index) => {
                            return (
                                <motion.div key={product._id} initial = {{opacity : 0}} animate = {{opacity : 1}} transition={{delay : index * 0.2}}>
                                    <LazyProductFunc productData={product} />
                                </motion.div>
                            )
                        })}
                    </Suspense>
                </div>
            </div>
            <Footer />
        </div>
    )
}