"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import AddReport from '../components/AddReport';
import AddUser from '../components/AddUser';
import AddCategory from '../components/AddCategory';
import AddSubcategory from '../components/AddSubcategory';
import AddParametro from '../components/AddParametro';
import AddUserPermission from '../components/AddUserPermission';
import '../components/styles.css';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState({});
    const [parametros, setParametros] = useState({});
    const [reportes, setReportes] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [activeParametro, setActiveParametro] = useState(null);
    const [isAddingReport, setIsAddingReport] = useState(false);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
    const [isAddingParametro, setIsAddingParametro] = useState(false);
    const [isAddingPermissions, setIsAddingPermissions] = useState(false);
    const [role, setRole] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/'); // Redirige a la página principal o de login si no hay usuario
        } else {
            const storedRole = localStorage.getItem('role');
            const storedUsername = localStorage.getItem('username');
            setRole(storedRole);
            setUsername(storedUsername);
    
            fetchCategorias();
            fetchSubcategorias();
            fetchParametros();
    
            // Solo para usuarios, cargar permisos
            if (storedRole !== 'admin') {
                fetchUserPermissions(userId);
            }
            fetchReportes(storedRole);
        }
    }, []);

    const [userPermissions, setUserPermissions] = useState([]);

    const filterCategorias = (categoria) => {
        return role === 'admin' || userPermissions.some(permiso => permiso.categoria_id === categoria.id);
    };
    
    const filterSubcategories = (categoriaId, subcategoria) => {
        // Verifica si el usuario tiene acceso a la subcategoría
        const permisosCategoria = userPermissions.find(permiso => permiso.categoria_id === categoriaId);
        return role === 'admin' || (permisosCategoria && permisosCategoria.subcategorias.includes(subcategoria.id));
    };
    
    const filterParametros = (subcategoriaId, parametro) => {
        // Verifica si el usuario tiene acceso al parámetro
        const permisosSubcategoria = Object.keys(userPermissions).flatMap((cat_id)=>(
            Object.keys(userPermissions[cat_id]).flatMap((subcat_id)=>(
                Object.keys(userPermissions[cat_id][subcat_id]).flatMap((pat_id)=>(
                    userPermissions[cat_id][subcat_id][pat_id]
                ))
            ))
        ))
        return role === 'admin' || (permisosSubcategoria && permisosSubcategoria.includes(parametro.id));
    };
    
    const filterReportes = (parametroId, reporte) => {
        console.log(`Filtrando reporte para parametroId ${parametroId}:`, reporte);
        return role === 'admin' || reporte.visible;
    };
    
    
    const fetchUserPermissions = async (userId) => {
        try {
            const response = await axios.get(`http://3.89.107.130:5000/get_user_permissions?user_id=${userId}`);
            const permisos = response.data.map(permiso => {
                return {
                    categoria_id: permiso.categoria_id,
                    subcategorias: permiso.subcategorias.map(sub => sub.subcategoria_id),
                    parametros: permiso.subcategorias.flatMap(sub => sub.parametros.map(param => param.parametro_id)),
                };
            });
            console.log(permisos)
            setUserPermissions(permisos);  // Cambiado para almacenar también subcategorías y parámetros
        } catch (error) {
            console.error('Error al obtener permisos del usuario:', error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await axios.get('http://3.89.107.130:5000/get_categories');
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };

    const fetchSubcategorias = async () => {
        try {
            const response = await axios.get('http://3.89.107.130:5000/get_subcategories');
            const subcategoriasMap = {};
            response.data.forEach(sub => {
                if (!subcategoriasMap[sub.categoria_id]) {
                    subcategoriasMap[sub.categoria_id] = [];
                }
                subcategoriasMap[sub.categoria_id].push(sub);
            });
            setSubcategorias(subcategoriasMap);
        } catch (error) {
            console.error('Error al obtener subcategorías:', error);
        }
    };

    const fetchParametros = async () => {
        try {
            const response = await axios.get('http://3.89.107.130:5000/get_parametros');
            const parametrosMap = {};
            response.data.forEach(param => {
                if (!parametrosMap[param.subcategoria_id]) {
                    parametrosMap[param.subcategoria_id] = [];
                }
                parametrosMap[param.subcategoria_id].push(param);
            });
            setParametros(parametrosMap);
        } catch (error) {
            console.error('Error al obtener parametros:', error);
        }
    };

    const fetchReportes = async (role) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`http://3.89.107.130:5000/get_reports?user_id=${userId}`);
            const reportesGrouped = {};

            response.data.forEach((reporte) => {
                const { categoria_id, subcategoria_id, parametro_id } = reporte;

                if (!reportesGrouped[categoria_id]) {
                    reportesGrouped[categoria_id] = {};
                }
                if (!reportesGrouped[categoria_id][subcategoria_id]) {
                    reportesGrouped[categoria_id][subcategoria_id] = {};
                }
                if (!reportesGrouped[categoria_id][subcategoria_id][parametro_id]) {
                    reportesGrouped[categoria_id][subcategoria_id][parametro_id] = [];
                }
                reportesGrouped[categoria_id][subcategoria_id][parametro_id].push(reporte);
            });
            setReportes(reportesGrouped);
        } catch (error) {
            console.error('Error al obtener reportes:', error);
        }
    };

    const toggleCategory = (id) => {
        setActiveCategory(activeCategory === id ? null : id);
    };

    const toggleSubcategory = (categoriaId, subcategoriaId) => {
        setActiveSubcategory(activeSubcategory === subcategoriaId ? null : subcategoriaId);
        setActiveParametro(null); // Reiniciar el parámetro activo
    };

    const toggleParametro = (subcategoriaId, parametroId) => {
        setActiveParametro(activeParametro === parametroId ? null : parametroId);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        router.push('/');
    };

    const handleReportClick = async (reporteId) => {
        if (loadingReport) return;
        setLoadingReport(true);
        try {
            await router.push(`/reports/${reporteId}`);
        } catch (error) {
            console.error('Error al cargar el reporte:', error);
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Reportes de Biocells</h1>
            {username && (
                <p className="logged-in-user">
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Icono de usuario" style={{ width: '20px', marginRight: '8px' }} />
                    Bienvenido, {username}!
                </p>
                )}
            <button className="logout-button" onClick={handleLogout}>
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828395.png" alt="Icono cerrar sesión" />
                Cerrar Sesión
            </button>
            {role === 'admin' && (
                <div className="admin-actions">
                <ul className="admin-menu">
                    <li>
                        <button className="menu-item" onClick={() => setIsAddingReport(!isAddingReport)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Icono añadir reporte" style={{ width: '20px', marginRight: '8px' }} />
                            Añadir Reporte
                        </button>
                        {isAddingReport && <AddReport />}
                    </li>
                    <li>
                        <button className="menu-item" onClick={() => setIsAddingUser(!isAddingUser)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="Icono añadir usuario" style={{ width: '20px', marginRight: '8px' }} />
                            Añadir Usuario
                        </button>
                        {isAddingUser && <AddUser />}
                    </li>
                    <li>
                        <button className="menu-item" onClick={() => setIsAddingCategory(!isAddingCategory)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" alt="Icono añadir categoría" style={{ width: '20px', marginRight: '8px' }} />
                            Añadir Categoría
                        </button>
                        {isAddingCategory && <AddCategory />}
                    </li>
                    <li>
                        <button className="menu-item" onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/3767/3767077.png" alt="Icono añadir subcategoría" style={{ width: '20px', marginRight: '8px' }} />
                            Añadir Subcategoría
                        </button>
                        {isAddingSubcategory && <AddSubcategory />}
                    </li>
                    <li>
                        <button className="menu-item" onClick={() => setIsAddingParametro(!isAddingParametro)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png" alt="Icono añadir parámetro" style={{ width: '20px', marginRight: '8px' }} />
                            Añadir Parámetro
                        </button>
                        {isAddingParametro && <AddParametro />}
                    </li>
                    <li>
                        <button className="menu-item" onClick={() => setIsAddingPermissions(!isAddingPermissions)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/3064/3064214.png" alt="Icono añadir permisos" style={{ width: '20px', marginRight: '8px' }} />
                            Añadir Permisos
                        </button>
                        {isAddingPermissions && <AddUserPermission />}
                    </li>
                </ul>
                </div>
            )}
            {/* Mensaje introductorio */}
            <div className="intro-message">
                <p>Las siguientes categorías están disponibles. Por favor, verifica tus reportes haciendo clic en las subcategorías correspondientes.</p>
            </div>

            <div className="report-container">
        {categorias.filter(categoria => filterCategorias(categoria)).map(categoria => (
            <div key={categoria.id} className="category">
                <h2 className="category-title" onClick={() => toggleCategory(categoria.id)}>{categoria.nombre}</h2>
                {activeCategory === categoria.id && (
                    <div className="subcategory-list">
                        {subcategorias[categoria.id]?.filter(sub => filterSubcategories(categoria.id, sub)).map(sub => (
                            <div key={sub.id} className="subcategory">
                                <h3 
                                    className={`subcategory-title ${parametros[sub.id] ? 'has-content' : 'empty'}`} 
                                    onClick={() => parametros[sub.id] && toggleSubcategory(categoria.id, sub.id)}
                                >
                                    {sub.nombre}
                                </h3>
                                {activeSubcategory === sub.id && parametros[sub.id] && (
                                    <div className="parametro-list">
                                        {parametros[sub.id]?.filter(param => filterParametros(sub.id, param)).map(param => (
                                            <div 
                                                key={param.id} 
                                                className="parametro-title"
                                                onClick={() => toggleParametro(sub.id, param.id)}
                                            >
                                                {param.nombre}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeParametro && activeSubcategory === sub.id && (
                                    <div className="report-list">
                                        {reportes[categoria.id]?.[sub.id]?.[activeParametro]?.length > 0 ? (
                                            reportes[categoria.id][sub.id][activeParametro].map((reporte) => (
                                                <div
                                                    key={reporte.id}
                                                    onClick={() => handleReportClick(reporte.id)}
                                                    className={`report-item ${reporte.visible ? 'active' : 'inactive'}`}
                                                >
                                                    {reporte.nombre || 'Nombre no disponible'}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay reportes disponibles para este parámetro.</p>
                                        )}
                                    </div>
                                )}
                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            </div>
        </div>
    );
};

export default Dashboard;
