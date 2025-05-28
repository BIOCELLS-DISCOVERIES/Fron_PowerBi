"use client";

import { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Asegúrate de que el archivo CSS está importado

const AddCategory = ({ onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://3.89.107.130:5000/add_category', { nombre: categoryName });

            if (response.status === 200) {
                // Mostrar mensaje de éxito como alerta
                alert(response.data.message || 'Categoría añadida exitosamente.');
                setCategoryName('');
                if (onCategoryAdded) {
                    onCategoryAdded(); // Llama a la función callback si se proporciona
                }
            }
        } catch (err) {
            // Verificar si el error contiene una respuesta
            if (err.response) {
                // Si el backend devuelve un mensaje de error, mostrarlo en un alert
                alert(err.response.data.error || 'Error al añadir la categoría. Intenta de nuevo.');
            } else {
                // Si no hay respuesta del backend, mostrar un mensaje genérico
                alert('Error al añadir la categoría. Intenta de nuevo.');
            }
        }
    };

    return (
        <div className="add-report-container"> {/* Usar la misma clase del formulario de añadir reporte */}
            <h2 className="add-report-title">Añadir Nueva Categoría</h2> {/* Usar el mismo título */}
            <form onSubmit={handleSubmit} className="add-report-form"> {/* Usar la misma clase para el formulario */}
                <input
                    type="text"
                    placeholder="Nombre de la Categoría" // Cambia el placeholder
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="add-report-input" // Usar la misma clase para los inputs
                />
                <button type="submit" className="add-report-button">Añadir Categoría</button> {/* Usar la misma clase para el botón */}
            </form>
        </div>
    );
};

export default AddCategory;
