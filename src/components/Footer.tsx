import { BsFacebook, BsInstagram, BsWhatsapp } from 'react-icons/bs';

// Styles
import '../styles/Footer.css';
// Sources
import imgLogo from '../assets/images/Logo.png';

function Footer() {
    return (
        <footer>
            <span className='section_title reverse' style={{margin:'0'}}></span>
            <img src={imgLogo} alt='Logotipo de El Piloncito' draggable='false' width='180px' />
            <div>
                <h1>AREPAS</h1>
                <h2>Tío Lucho</h2>
            </div>
            <div className='socialnetworks_container'>
                <a href='/' target='_blank' rel='noopener noreferrer'>
                    <BsFacebook size={30} color='var(--white)'/>
                </a>
                <a href='/' target='_blank' rel='noopener noreferrer'>
                    <BsInstagram size={30} color='var(--white)' />
                </a>
                <a href='https://api.whatsapp.com/send?phone=573137593407&text=%C2%A1Deseo%20solicitar%20un%20servicio%20de%20domicilio!' target='_blank' rel='noopener noreferrer'>
                    <BsWhatsapp size={30} color='var(--white)' />
                </a>
            </div>
            <p className='copyrigth'>Copyright &copy; 2023 Tío Lucho.<br />Todos los derechos reservados.</p>
        </footer>
    );
}

export { Footer };