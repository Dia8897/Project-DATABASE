import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function BootstrapFooter() {
    return (
        <footer className="bg-white border-top py-3 w-full">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">

                {/* Brand / Logo */}
                <div className="mb-2 mb-md-0">
                    <h5 className="mb-0">Hosting Agency</h5>
                </div>

                {/* Quick Links */}

                <ul className=" container d-flex  gap-8 nav mb-2 mb-md-0">
                    <li className="nav-item">
                        <a href="#home" className="nav-link px-2 text-muted">Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="#features" className="nav-link px-2 text-muted">Features</a>
                    </li>
                    <li className="nav-item">
                        <a href="#about" className="nav-link px-2 text-muted">About Us</a>
                    </li>
                    <li className="nav-item">
                        <a href="#contact" className="nav-link px-2 text-muted">Contact</a>
                    </li>
                </ul>


                {/* Social Icons */}
                <div className="d-flex gap-3">
                    <a href="#" className="text-muted"><Facebook size={20} /></a>
                    <a href="#" className="text-muted"><Twitter size={20} /></a>
                    <a href="#" className="text-muted"><Instagram size={20} /></a>
                    <a href="#" className="text-muted"><Linkedin size={20} /></a>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="text-center text-muted small mt-2">
                &copy; {new Date().getFullYear()} Hosting Agency. All rights reserved.
            </div>
        </footer>
    );
}
