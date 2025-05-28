"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Menu from './components/Menu';
import './components/styles.css';

const Home = () => {
    const [user, setUser] = useState(null); 
    const router = useRouter(); 

    const handleLoginSuccess = (user) => {
        console.log("Usuario recibido en Home:", user);
        setUser(user); 
        router.push('/dashboard'); 
    };

    const cerrarSesion = () => {
        // Lógica para cerrar sesión
        setUser(null); // Limpiar el estado del usuario
        router.push('/'); // Redirigir a la página principal
    };

    return (
        <div className="home-container">
            <header>
                <h1 className="header-title">Biocells Power BI</h1>
                <button 
                    className="login-button" 
                    onClick={() => router.push('/login')}
                >
                    Iniciar Sesión
                </button>

                {user && (
                    <>
                        <p className="logged-in-user">Bienvenido, {user.username}!</p>
                        <button className="logout-button" onClick={cerrarSesion}>
                            Cerrar sesión
                        </button>
                    </>
                )}
            </header>
            <Menu />
        </div>
    );
};

export default Home;
