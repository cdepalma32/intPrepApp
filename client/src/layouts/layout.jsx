// src/components/layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Shared Header */ }
            <Header />

            {/* Main routed content */ }
                <main className="flex-1 p-4">
                    <Outlet />
                </main>

                    {/* Shared footer */ }
                    <Footer />
                        </div>
    );
};

export default Layout;