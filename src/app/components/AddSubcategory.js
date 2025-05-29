"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Asegúrate de que el archivo CSS está importado

const AddSubcategory = ({ onSubcategoryAdded }) => {
    const [subcategoryName, setSubcategoryName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    // Cargar categorías al iniciar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://back-power-bi.onrender.com/get_categories'); // Cambia esto al endpoint correcto
                setCategories(response.data); // Asumiendo que la respuesta contiene un array de categorías
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                alert('Error al cargar las categorías.'); // Mostrar error como alerta
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://back-power-bi.onrender.com/add_subcategory', { nombre: subcategoryName, categoria_id: categoryId });

            if (response.status === 200) {
                // Mostrar mensaje de éxito como alerta
                alert(response.data.message || 'Subcategoría añadida exitosamente.');
                setSubcategoryName('');
                setCategoryId('');
                if (onSubcategoryAdded) {
                    onSubcategoryAdded(); // Llama a la función callback si se proporciona
                }
            }
        } catch (err) {
            // Verificar si el error contiene una respuesta
            if (err.response) {
                // Si el backend devuelve un mensaje de error, mostrarlo en un alert
                alert(err.response.data.error || 'Error al añadir la subcategoría. Intenta de nuevo.');
            } else {
                // Si no hay respuesta del backend, mostrar un mensaje genérico
                alert('Error al añadir la subcategoría. Intenta de nuevo.');
            }
        }
    };

    return (
        <div className="add-report-container"> {/* Usar la misma clase del formulario de añadir reporte */}
            <h2 className="add-report-title">Añadir Nueva Subcategoría</h2> {/* Usar el mismo título */}
            <form onSubmit={handleSubmit} className="add-report-form"> {/* Usar la misma clase para el formulario */}
                <input
                    type="text"
                    placeholder="Nombre de la Subcategoría" // Cambia el placeholder
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    required
                    className="add-report-input" // Usar la misma clase para los inputs
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="add-report-select" // Asegúrate de que esta clase exista en tu CSS
                >
                    <option value="" disabled>Seleccionar Categoría</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit" className="add-report-button">Añadir Subcategoría</button> {/* Usar la misma clase para el botón */}
            </form>
        </div>
    );
};

export default AddSubcategory;
