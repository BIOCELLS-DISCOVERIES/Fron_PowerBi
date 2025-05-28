"use client"; // Asegúrate de que esta línea esté presente

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const ReportePage = () => { 
    const params = useParams(); // Obtén los parámetros de la URL
    const { id } = params; // Extrae 'id' del objeto params
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/'); // Redirect to home if no userId is found
        }

        if (!id) {
            setError("ID de reporte no proporcionado");
            setLoading(false);
            return;
        }

        const fetchReporte = async () => {
            try {
                const response = await fetch(`http://3.89.107.130:5000/get_report?id=${id}`);
                if (!response.ok) throw new Error(`Error al obtener el reporte`);

                const data = await response.json();
                setReporte(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReporte();
    }, [id, router]); // Add 'router' to the dependency array

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!reporte) return <div>No se encontró el reporte.</div>;

    return (
        <div>
            <h4>{reporte.nombre}</h4>
            <iframe 
                title={reporte.nombre}
                src={reporte.link}
                width="100%"
                height="600px"
                style={{ border: 'none' }}
            ></iframe>
        </div>
    );
};

export default ReportePage;
