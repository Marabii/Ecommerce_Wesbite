import React, { useState, useEffect, useContext } from "react";
import "./Login.css"

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import {isLoggedInContext} from "../../App"


export default function Login() {
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const [formData, setFormData] = useState()
    const { setIsLoggedIn } = useContext(isLoggedInContext)
    const navigate = useNavigate()

    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    async function handleSumbit() {
        try {
            const response = await axios.post(`${serverURL}/api/login`, formData, {withCredentials : true})
            if (response.data.isLoggedIn) {
                setIsLoggedIn(true)
                navigate("/")
                window.location.reload(true)
            } else {
                setIsLoggedIn(false)
            }
        } catch(e) {
            console.error(e)
        }
    }

    return (
        <div className="login-container">
            <Header />
            <form onSubmit={(e) => e.preventDefault()}>
                <h2>LOGIN</h2>
                <span>Please enter your e-mail and password</span>
                <input type="text" placeholder="Email" name="email" onChange={(e) => handleChange(e)}/>
                <input type="text" placeholder="Password" name = "pw" onChange={(e) => handleChange(e)}/>
                <button className="shop-button" onClick={handleSumbit}>LOGIN</button>
                <div>Don't have an account ? <Link to = "/register">Register</Link></div>
            </form>
            <Footer />
        </div>
    )
}