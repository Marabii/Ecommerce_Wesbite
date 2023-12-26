import React from "react";
import "./App.css"
import { useState, createContext, useEffect } from "react";

import {Routes, Route, BrowserRouter} from "react-router-dom"
import axios from "axios"

import HomePage from "./pages/Home/HomePage";
import ProductPage from "./pages/productPage/ProductPage";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import UpdateProduct from "./pages/UpdateProduct/UpdateProduct";
import SuccessfulPayment from "./pages/SuccessfulPayment/SuccessfulPayment";

export const isLoggedInContext = createContext();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const verifyUser = async () => {
      const response = await axios.get(`${serverURL}/api/verifyUser`, {withCredentials : true})
      setIsLoggedIn(response.data.isLoggedIn)
      setIsAdmin(response.data.isAdmin)
    }
    verifyUser()
  }, [])

  return (
    <isLoggedInContext.Provider value={{isLoggedIn, setIsLoggedIn, isAdmin}}>
      <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<HomePage />} />
            <Route path="/product/:id" element = {<ProductPage />}/>
            <Route path="/register" element = {<Register />}/>
            <Route path = "/login" element = {<Login />}/>
            <Route path = "/collection/:collectionName" element = {<CollectionPage />}/>
            <Route path = "/admin-panel-rekjherh651" element = {<AdminPanel />}/>
            <Route path = "/update-product/:id" element = {<UpdateProduct />}/>
            <Route path = "/successful-payment/:id" element = {<SuccessfulPayment />}/>
        </Routes>
      </BrowserRouter>
    </isLoggedInContext.Provider>
  )
}