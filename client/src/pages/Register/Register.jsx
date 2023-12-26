import React from "react"
import "./Register.css"

import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

import axios from "axios"
import { Link } from "react-router-dom"

export default function Register() {
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER

    return (
        <div className="register-container">
            <Header />
            <form method="POST" action={`${serverURL}/api/register`}>
                <h2>Register</h2>
                <span>Please fill in the information below:</span>
                <input type="text" placeholder="First Name" name="fname"/>
                <input type="text" placeholder="Last Name" name = "lname"/>
                <input type="text" placeholder="Email" name = "email" />
                <input type="text" placeholder="Password" name="pw" />
                <button className="shop-button" type="submit">Create Account</button>
                <div>Already Have An Account ? <Link to = "/login">Login</Link></div>
            </form>
            <Footer />
        </div>
    )
}