import React from "react"
import "./Footer.css"
import { Facebook, Twitter, Instagram } from "lucide-react"
export default function Footer() {
    return (
        <footer>
            <ul>
                <li>ABOUT US</li>
                <li>We craft affordable, high-quality menswear for your everyday and once-in-a-lifetime moments.</li>
                <li className="footer-social-media">
                    <ul>
                        <li><Facebook fill="grey" stroke="none" /></li>
                        <li><Instagram  stroke="grey" /></li>
                        <li><Twitter fill="grey" stroke="none" /></li>
                    </ul>
                </li>
            </ul>
            <ul>
                <li>Services</li>
                <li>Contact Us</li>
                <li>Unhemmed</li>
                <li>Returns And Exchanges</li>
                <li>Terms And Conditions</li>
                <li>Privacy</li>
                <li>Help</li> 
            </ul>
            <ul>
                <li>NEWS</li>
                <li>Subscribe to receive updates, access to exclusive deals, and more.</li>
                <li><input type="text" placeholder="Enter Your Email Address" /></li>
                <li><button className="shop-button">SUBSCRIBE</button></li>
            </ul>
        </footer>
    )
}