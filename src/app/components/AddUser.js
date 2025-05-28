"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Asegúrate de que el archivo CSS está importado

const AddUser = ({ onUserAdded }) => {
    const [username, setUsername] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // Para manejar el error de nombre de usuario repetido

    // Cargar roles al iniciar el componente
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://3.89.107.130:5000/get_roles'); // URL del endpoint
                setRoles(response.data); // Asegúrate de que response.data contenga un array de roles
            } catch (err) {
                alert('Error al cargar los roles.');
            }
        };

        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validar el correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
        if (!emailRegex.test(correo)) {
            setErrorMessage('Por favor, ingresa un correo válido.');
            window.alert('Por favor, ingresa un correo válido.'); // Mostrar el error en un alert
            return;
        }
    
        try {
            // Enviar la solicitud POST al backend
            const response = await axios.post('http://3.89.107.130:5000/add_user', {
                username,
                nombre,
                correo,
                password,
                role_id: roleId,
            });
    
            // Si la solicitud es exitosa
            if (response.status === 200) {
                alert('Usuario añadido exitosamente.');
                setUsername('');
                setNombre('');
                setCorreo('');
                setPassword('');
                setRoleId('');
                setErrorMessage(''); // Limpiar el mensaje de error
                if (onUserAdded) {
                    onUserAdded(); // Llamar a la función callback si se proporciona
                }
            }
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.error || 'Error al añadir el usuario. Intenta de nuevo.');
                window.alert(err.response.data.error || 'Error al añadir el usuario. Intenta de nuevo.'); // Mostrar error en alert
            } else {
                setErrorMessage('Error al añadir el usuario. Intenta de nuevo.');
                window.alert('Error al añadir el usuario. Intenta de nuevo.'); // Mostrar error en alert
            }
        }
    };
    
    return (
        <div className="add-report-container"> {/* Usar la misma clase del formulario de añadir reporte */}
            <h2 className="add-report-title">Añadir Nuevo Usuario</h2> {/* Usar el mismo título */}
            <form onSubmit={handleSubmit} className="add-report-form"> {/* Usar la misma clase para el formulario */}
                
                <input
                    type="text"
                    placeholder="Nombre Completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="add-report-input"
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className="add-report-input"
                    onInvalid={(e) => e.target.setCustomValidity("Por favor, ingresa un correo válido")}
                    onInput={(e) => e.target.setCustomValidity("")} // Limpia el mensaje al corregir
                />

                <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="add-report-input"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="add-report-input"
                />
                <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                    className="add-report-select"
                >
                    <option value="" disabled>Seleccionar Rol</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit" className="add-report-button">Añadir Usuario</button>
            </form>
        </div>
    );
};

export default AddUser;
