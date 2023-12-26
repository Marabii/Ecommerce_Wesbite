import React, { useEffect } from "react";
import "./AddProduct.css"

import { useState } from "react";
import axios from "axios";

export default function AddProduct(props) {
    const { category, handleShowAddProduct } = props
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const uniqueID = Date.now()
    const [formData, setFormData] = useState({category : category})
    const imagesData = new FormData();

    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const getImages = () => {
        const thumbnailInput = document.getElementById('thumbnail');
        const hoverInput = document.getElementById('hover');
        const otherImagesInput = document.getElementById('other-images');


        imagesData.append('thumbnail.png', thumbnailInput.files[0]);

        // Append hover with a fixed name
        imagesData.append('hover.png', hoverInput.files[0]);

        // Append other images with unique names based on the current date
        const currentDate = new Date();
        const otherImages = otherImagesInput.files;

        for (let i = 0; i < otherImages.length; i++) {
            const fileName = `other_${currentDate.getTime()}_${i}.png`;
            imagesData.append(fileName, otherImages[i]);
        }
    }

    const saveProduct = async () => {
        try {
            const responseData = await axios.post(`${serverURL}/api/saveProductData`, {...formData, nameInDirectory : uniqueID, properties : {colors : separateByComma(colorInput), size : separateByComma(sizeInput)}}, {withCredentials : true})

            getImages()
            const responseImg = await axios.post(`${serverURL}/api/saveProductImages/query?id=${uniqueID}`, imagesData, {withCredentials : true})
            window.location.reload(true)

        } catch (e) {
            console.log(e)
        }
    }

    const handleColorInputChange = (event) => {
        setColorInput(event.target.value);
    };

    const handleSizeInputChange = (event) => {
        setSizeInput(event.target.value);
    };

    const separateByComma = (input) => {
        return input.split(",").map(element => element.trim())
    }

    useEffect(() => {
        const sizesArray = separateByComma(sizeInput);
        console.log(sizesArray)
    }, [sizeInput])

    return (
        <section className="add-product">
            <button onClick={() => handleShowAddProduct(category, false)}>Close</button>
            <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" required id="name" autoComplete="name" onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" required id="description" autoComplete="description" onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" required id="price" min={0} onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="itemsRemaining">Items Remaining</label>
                    <input type="number" name="itemsRemaining" required id="itemsRemaining" min={0} onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="promo">Promo (Put 0 if there's no promo on this product)</label>
                    <input type="number" name="promo" id="promo" required min={0} max={100} onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="color">Colors</label>
                    <input type="text" name="colors" id="color" required value={colorInput} onChange={(e) => handleColorInputChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="sizes">Sizes</label>
                    <input type="text" name="sizes" id="sizes" required value={sizeInput} onChange={(e) => handleSizeInputChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor="thumbnail">Thumbnail</label>
                    <input type="file" accept="image/*" required id="thumbnail" />
                </div>
                <div className="form-group">
                    <label htmlFor="hover">Hover</label>
                    <input type="file" accept="image/*" required id="hover" />
                </div>
                <div className="form-group">
                    <label htmlFor="other-images">Other Images</label>
                    <input type="file" accept="image/*" multiple required id="other-images" />
                </div>
                <button className="save-button" onClick={saveProduct}>Save Product</button>
            </form>
        </section>

    )
}