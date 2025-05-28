"use client";

import './styles.css';

const Menu = () => {
    return (
        <div className="content">
            <h1 className="welcome-title">Bienvenido a la Página de Reportes de Power BI</h1>
            <p className="welcome-description">
                Esta es una plataforma donde podrás acceder a diferentes reportes y análisis de datos realizados por Power BI.
            </p>
            <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeN__49U7K20YHe0Z9LpQ8G6_l_pwRzJsD0Q&s" 
                alt="Reporte Power BI"
                className="report-image"
            />
            
            <footer className="footer">
                <img 
                    src="https://www.biocellsdiscoveries.med.ec/wp-content/uploads/2020/08/Biocells-discoveries-logo.png" 
                    alt="Biocells Logo"
                    className="footer-logo"
                />
                <div className="footer-content">
                    <div className="footer-contact-info">
                        <h3>Contáctanos</h3>
                        <p>Pionera en biotecnología médica brinda servicios de salud vanguardistas en el Ecuador.</p>
                        <p>1800 246 235 / 3550043</p>
                        <p>info@biocells.med.ec</p>
                    </div>
                    <div className="footer-presence">
                        <h3>Presencia en</h3>
                        <p>las 24 provincias del Ecuador</p>
                    </div>
                    <div className="footer-terms">
                        <a href="#">Términos y condiciones</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Menu;
