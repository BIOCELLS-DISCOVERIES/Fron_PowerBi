"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const AddParametro = ({ onParametroAdded }) => {
    const [parametroName, setParametroName] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]); // Nueva variable de estado para las categorías

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, subcategoriesResponse] = await Promise.all([
                    axios.get('https://back-power-bi.onrender.com/get_categories'), // Cargar categorías
                    axios.get('https://back-power-bi.onrender.com/get_subcategories'), // Cargar subcategorías
                ]);
                setCategories(categoriesResponse.data); // Guardar categorías
                setSubcategories(subcategoriesResponse.data); // Guardar subcategorías
            } catch (err) {
                console.error("Error al cargar datos:", err);
                alert('Error al cargar las categorías o subcategorías.');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://back-power-bi.onrender.com/add_parametro', {
                nombre: parametroName,
                subcategoria_id: subcategoryId,
            });

            if (response.status === 200) {
                alert('Parámetro añadido exitosamente.');
                setParametroName('');
                setSubcategoryId('');
                if (onParametroAdded) {
                    onParametroAdded();
                }
            }
        }  catch (err) {
            // Verificar si el error contiene una respuesta
            if (err.response) {
                // Si el backend devuelve un mensaje de error, mostrarlo en un alert
                alert(err.response.data.error || 'Error al añadir el parámetro. Intenta de nuevo.');
            } else {
                // Si no hay respuesta del backend, mostrar un mensaje genérico
                alert('Error al añadir el parámetro. Intenta de nuevo.');
            }
        }
    };

    return (
        <div className="add-report-container"> 
            <h2 className="add-report-title">Añadir Nuevo Parámetro</h2> 
            <form onSubmit={handleSubmit} className="add-report-form"> 
                <input
                    type="text"
                    placeholder="Nombre del Parámetro" 
                    value={parametroName}
                    onChange={(e) => setParametroName(e.target.value)}
                    required
                    className="add-report-input" 
                />
                <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    required
                    className="add-report-select" 
                >
                    <option value="" disabled>Seleccionar Subcategoría</option>
                    {subcategories.map((subcategory) => {
                        // Buscar la categoría de la subcategoría usando categoria_id
                        const category = categories.find(cat => cat.id === subcategory.categoria_id);
                        return (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.nombre} ({category ? category.nombre : 'Sin categoría'})
                            </option>
                        );
                    })}
                </select>
                <button type="submit" className="add-report-button">Añadir Parametro</button> 
            </form>
        </div>
    );
};

export default AddParametro;
