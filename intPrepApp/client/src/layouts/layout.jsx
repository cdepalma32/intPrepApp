// src/components/layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

const layout = () => {
    return (
        <div className='app-wrapper'>
            {/* Shared Header */ }
            <header>
                <h1>IntPrepApp</h1>
                { /* Navbar will go here */ }
                </header>

                { /* Main Content based on route */ }
                <main className="main-content">
                    <Outlet /> {/* Injects child routes here */ }
                    </main>

                    {/* Shared footer */ }
                    <footer>
                        <p>&copy; 2025 IntPrepApp</p>
                        </footer>
                        </div>
    );
};

{/* Later on, adding a different layout for Admin, ie, can be swapped */ }

export default Layout;