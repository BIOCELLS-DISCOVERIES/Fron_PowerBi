"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia el spinner de carga

        try {
            const response = await axios.post('https://back-power-bi.onrender.com/login', {
                username,
                password
            });

            if (response.status === 200) {
                const { token, user_id, rol } = response.data;
                localStorage.setItem('token', token); // Guardar el token en localStorage
                localStorage.setItem('userId', user_id);
                localStorage.setItem('role', rol);
                localStorage.setItem('username', username);
                router.push('/dashboard');
            } else {
                alert('Error en el inicio de sesión');
            }
        } catch (error) {
            alert('Error en el inicio de sesión: ' + (error.response?.data.message || error.message));
        } finally {
            setLoading(false); // Finaliza el spinner de carga
        }
    };

    return (
        <div className="login-page">
            <div className="login-modal">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                {loading && <div className="spinner">Cargando...</div>} {/* Spinner de carga */}
            </div>
        </div>
    );
};

export default Login;
