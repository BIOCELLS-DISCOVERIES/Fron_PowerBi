import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Asegúrate de que esta ruta sea correcta

const AddReport = () => {
    const [nombre, setNombre] = useState('');
    const [link, setLink] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [subcategoriaId, setSubcategoriaId] = useState('');
    const [parametroId, setParametroId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [parametros, setParametros] = useState([]);
    const [isLoadingSubcategorias, setIsLoadingSubcategorias] = useState(false);
    const [isLoadingParametros, setIsLoadingParametros] = useState(false);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('https://back-power-bi.onrender.com/get_categories');
                setCategorias(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategorias();
    }, []);

    const handleCategoriaChange = async (e) => {
        const selectedCategoriaId = e.target.value;
        setCategoriaId(selectedCategoriaId);
        setSubcategoriaId('');
        setSubcategorias([]);
        setParametros([]); // Limpiar parámetros al cambiar de categoría

        if (selectedCategoriaId) {
            setIsLoadingSubcategorias(true);
            try {
                const response = await axios.get(`https://back-power-bi.onrender.com/get_subcategories?categoria_id=${selectedCategoriaId}`);
                setSubcategorias(response.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            } finally {
                setIsLoadingSubcategorias(false);
            }
        }
    };

    const handleSubcategoriaChange = async (e) => {
        const selectedSubcategoriaId = e.target.value;
        setSubcategoriaId(selectedSubcategoriaId);
        setParametroId(''); // Limpiar parámetro seleccionado

        if (selectedSubcategoriaId) {
            setIsLoadingParametros(true);
            try {
                const response = await axios.get(`https://back-power-bi.onrender.com/get_parametry?subcategoria_id=${selectedSubcategoriaId}`);
                setParametros(response.data);
            } catch (error) {
                console.error('Error fetching parameters:', error);
            } finally {
                setIsLoadingParametros(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role !== 'admin') {
                alert('No tienes permiso para agregar reportes');
                return;
            }

            const userId = localStorage.getItem('userId');
            const response = await axios.post('https://back-power-bi.onrender.com/add_report', {
                nombre,
                link,
                user_id: userId,
                categoria_id: categoriaId,
                subcategoria_id: subcategoriaId,
                parametro_id: parametroId,
            });
            alert(response.data.message);
            setNombre('');
            setLink('');
            setCategoriaId('');
            setSubcategoriaId('');
            setParametroId('');
        } catch (error) {
            alert('Error al añadir el reporte: ' + (error.response?.data.message || error.message));
        }
    };

    return (
        <div className="add-report-container">
            <h2 className="add-report-title">Nuevo Reporte</h2>
            <form onSubmit={handleSubmit} className="add-report-form">
                <input
                    type="text"
                    placeholder="Nombre del Reporte"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="add-report-input"
                />
                <input
                    type="text"
                    placeholder="Link del Reporte"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                    className="add-report-input"
                />
                <select
                    value={categoriaId}
                    onChange={handleCategoriaChange}
                    required
                    className="add-report-select"
                >
                    <option value="" disabled>Seleccionar Categoría</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
                <select
                    value={subcategoriaId}
                    onChange={handleSubcategoriaChange}
                    required
                    className="add-report-select"
                    disabled={isLoadingSubcategorias || subcategorias.length === 0}
                >
                    <option value="" disabled>Seleccionar Subcategoría</option>
                    {isLoadingSubcategorias ? (
                        <option>Cargando subcategorías...</option>
                    ) : (
                        subcategorias.map((subcategoria) => (
                            <option key={subcategoria.id} value={subcategoria.id}>
                                {subcategoria.nombre}
                            </option>
                        ))
                    )}
                </select>
                <select
                    value={parametroId}
                    onChange={(e) => setParametroId(e.target.value)}
                    required
                    className="add-report-select"
                    disabled={isLoadingParametros || parametros.length === 0}
                >
                    <option value="" disabled>Seleccionar Parámetro</option>
                    {isLoadingParametros ? (
                        <option>Cargando parámetros...</option>
                    ) : (
                        parametros.map((parametro) => (
                            <option key={parametro.id} value={parametro.id}>
                                {parametro.nombre}
                            </option>
                        ))
                    )}
                </select>
                <button type="submit" className="add-report-button">Añadir Reporte</button>
            </form>
        </div>
    );
};

export default AddReport;
