import React from 'react';

// Styles
import '../styles/Footer.css';
// Sources
import imgLogo from '../assets/images/Logo.png';
// import imgFacebook from '../assets/images/socialNetworks/Facebook.svg'; 
// import imgInstagram from '../assets/images/socialNetworks/Instagram.svg'; 
// import imgWhatsApp from '../assets/images/socialNetworks/WhatsApp.svg'; 

function Footer() {
    return (
        <footer>
            <span className='section_title reverse' style={{margin:'0'}}></span>
            <img src={imgLogo} alt='Logotipo de El Piloncito' draggable='false' width='110px' height='110px' />
            <div>
                <h1>El Piloncito</h1>
                <h2>COMIDAS RAPIDAS</h2>
            </div>
            <div className='socialnetworks_container'>
                <a href='https://www.facebook.com/p/El-Piloncito-Familiar-belencito-sede-principal-100057274638791/?locale=es_LA' target='_blank' rel='noopener noreferrer'>
                    {/* <img src={imgFacebook} alt='Facebook de el piloincito' draggable='false' width='30px' height='30px' /> */}
                </a>
                <a href='https://instagram.com/piloncito_belenlasplayas?igshid=MzRIODBiNWFIZA' target='_blank' rel='noopener noreferrer'>
                    {/* <img src={imgInstagram} alt='Instagram de el piloincito' draggable='false' width='30px' height='30px' /> */}
                </a>
                <a href='https://api.whatsapp.com/send?phone=573113175229&text=%C2%A1Vi%20su%20delicioso%20menu%20desde%20la%20carta%20digital!' target='_blank' rel='noopener noreferrer'>
                    {/* <img src={imgWhatsApp} alt='WhatsApp de el piloincito' draggable='false' width='30px' height='30px' /> */}
                </a>
            </div>
            <p className='copyrigth'>Copyright &copy; 2023 El Piloncito. Todos los derechos reservados.</p>
        </footer>
    );
}

export { Footer };