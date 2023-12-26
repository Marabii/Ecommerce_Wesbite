import React, { useEffect, useState} from "react"
import "./SuccessfulPayment.css"

import { Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useParams } from "react-router-dom"

import AccessDenied from "../AccessDenied/AccessDenied"

export default function SuccessfulPayment() {
    const { id } = useParams()
    const navigate = useNavigate()
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER
    const [hasPaid, setHasPaid] = useState()
    useEffect(() => {
        const verifyUser = async () => {
            const result = await axios.get(`${serverURL}/api/verifyPayment/${id}`, {withCredentials : true})
            console.log(result.data.hasPaid)
            setHasPaid(result.data.hasPaid)
        }

        verifyUser()
    }, [])

    if (!hasPaid) {
        return <AccessDenied />
    }

    return (
        <div className="background-success-payment">
            <div className="success-payment-container">
                <div className="check-mark">
                    <Check stroke="white" size={60} />
                </div>
                <h2>Awesome!</h2>
                <p>Your Purchase Has Been Confirmed. Check Your Email For More Details</p>
                <button className="shop-button" onClick={() => navigate("/")}>OK</button>
            </div>
        </div>
    )
}