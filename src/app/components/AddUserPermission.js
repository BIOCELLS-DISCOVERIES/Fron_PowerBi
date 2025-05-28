import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Asegúrate de que esta ruta sea correcta

const AddUserPermission = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [parametros, setParametros] = useState([]);  // Estado para parámetros
    const [usuarioId, setUsuarioId] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [subcategoriaId, setSubcategoriaId] = useState('');
    const [parametroId, setParametroId] = useState('');  // Estado para parámetro
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://3.89.107.130:5000/get_usuarios');
                setUsuarios(response.data);
            } catch (err) {
                setMessage({ type: 'error', text: 'Error al cargar los usuarios.' });
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://3.89.107.130:5000/get_categories');
                setCategorias(response.data);
            } catch (err) {
                setMessage({ type: 'error', text: 'Error al cargar las categorías.' });
            }
        };

        fetchUsuarios();
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (categoriaId) {
            const fetchSubcategorias = async () => {
                try {
                    const response = await axios.get(`http://3.89.107.130:5000/get_subcategories?categoria_id=${categoriaId}`);
                    setSubcategorias(response.data);
                } catch (err) {
                    setMessage({ type: 'error', text: 'Error al cargar las subcategorías.' });
                }
            };

            fetchSubcategorias();
        }
    }, [categoriaId]);

    useEffect(() => {
        if (subcategoriaId) {
            const fetchParametros = async () => {
                try {
                    const response = await axios.get(`http://3.89.107.130:5000/get_parametry?subcategoria_id=${subcategoriaId}`);
                    setParametros(response.data);
                } catch (err) {
                    setMessage({ type: 'error', text: 'Error al cargar los parámetros.' });
                }
            };

            fetchParametros();
        }
    }, [subcategoriaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://3.89.107.130:5000/add_user_permission', {
                usuario_id: usuarioId,
                categoria_id: categoriaId,
                subcategoria_id: subcategoriaId,
                parametro_id: parametroId,  // Envía el parámetro seleccionado
            });

            if (response.status === 200) {
                setMessage({ type: 'success', text: 'Permiso asignado exitosamente.' });
                setUsuarioId('');
                setCategoriaId('');
                setSubcategoriaId('');
                setParametroId('');  // Resetea el parámetro
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error al asignar permiso. Intenta de nuevo.' });
        }
    };

    return (
        <div className="add-report-container">
            <h2 className="add-report-title">Asignar Permisos de Usuario</h2>
            <form onSubmit={handleSubmit} className="add-report-form">
                <select
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    required
                    className="add-report-select"
                >
                    <option value="" disabled>Seleccionar Usuario</option>
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                            {usuario.nombre}
                        </option>
                    ))}
                </select>
                <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
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
                    onChange={(e) => setSubcategoriaId(e.target.value)}
                    required
                    className="add-report-select"
                    disabled={!subcategorias.length}
                >
                    <option value="" disabled>Seleccionar Subcategoría</option>
                    {subcategorias.map((subcategoria) => (
                        <option key={subcategoria.id} value={subcategoria.id}>
                            {subcategoria.nombre}
                        </option>
                    ))}
                </select>
                <select
                    value={parametroId}
                    onChange={(e) => setParametroId(e.target.value)}
                    required
                    className="add-report-select"
                    disabled={!parametros.length}
                >
                    <option value="" disabled>Seleccionar Parámetro</option>
                    {parametros.map((parametro) => (
                        <option key={parametro.id} value={parametro.id}>
                            {parametro.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit" className="add-report-button">Asignar Permiso</button>
            </form>
            {message.text && (
                <p className={message.type === 'error' ? 'error-message' : 'success-message'}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default AddUserPermission;
