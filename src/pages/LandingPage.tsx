import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
// Styles
import '../styles/LandingPage.css';
// Sources
import imgBanner from '../assets/images/Logo.png';
// import imgSedeLasPlayas from '../assets/images/landingPage/SedeLasPlayas.jpg';
// import imgSedeSantaMonica from '../assets/images/landingPage/SedeSantaMonica.jpg';

function LandingPage() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const navigate = useNavigate();

    useEffect( () => {
        setMenuConfig({
            active: false
        });
        setTimeout(() => {
            setIsLoading(false);
            addToastr('Bienvenido');
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

    const handleclickDeliveries = useCallback(() =>{
        setIsLoading(true);
        navigate('/delivery');
    }, [setIsLoading, navigate]);

    return (
        <div className='landingPage'>
            <Header landingPage />
            
            <div className='section home_section'>
                <img src={imgBanner} alt='Banner inicio arepas Tío Lucho' width='350px' height='350px' />
                <div className='fastOptions'>
                    <Button type='button' name='Clientes' icon='next' />
                    <Button type='button' name='Domicilios' icon='next' onClick={handleclickDeliveries} template='dark' />
                    <Button type='button' name='Empleados' icon='next' />
                </div>
                <p>¡Bienvenidos al auténtico sabor de las arepas en su máxima expresión! <br /><br />
                    En Arepas Tío Lucho, sabemos que la verdadera esencia de nuestras arepas radica en la combinación perfecta de ingredientes frescos, sazón inigualable y la rapidez que necesitas. <br />
                    Nuestra aplicación te permitirá descubrir nuestras irresistibles arepas, desde las clásicas hasta las más creativas y llenas de sabor. Realizar tus pedidos con solo unos pocos toques ahora es posible a través de nuestra app. <br />
                    ¡Prepárate para satisfacer tus antojos y deleitarte con cada bocado de nuestras deliciosas arepas. En Arepas Tío Lucho, nos enorgullece ofrecerte autenticidad, calidad y el genuino sabor de las arepas. Ven y disfruta de una experiencia culinaria auténtica que te hará volver por más!
                </p>

                <Button type='button' name='Domicilios' icon='next' onClick={handleclickDeliveries} />
            </div>

            <div className='section headquarters_section'>
                <h2 className='section_title'>Sedes</h2>
                <div className='headquarter_card'>
                    <div className='headquarter_image'>
                        {/* <img src={imgSedeSantaMonica} alt='Imagen sede santa monica' draggable='false' width='260px' height='260px' /> */}
                    </div>
                    <h3 className='headquarter_title'>Santa monica</h3>
                    <p className='headquarter_address'>Cra. 90#42c-26, Santa Monica, Medellín</p>
                    <a className='headquarter_route' href='https://goo.gl/maps/s2Z8aA17jkyz13SH7' target='_blank' rel='noopener noreferrer'>Cómo llegar</a>
                </div>
                <div className='headquarter_card'>
                    <div className='headquarter_image'>
                        {/* <img src={imgSedeLasPlayas} alt='Imagen sede belen' draggable='false' width='260px' height='260px' /> */}
                    </div>
                    <h3 className='headquarter_title'>Belen las playas</h3>
                    <p className='headquarter_address'>Cra. 72 #18-00, Belén, Medellín</p>
                    <a className='headquarter_route' href='https://goo.gl/maps/AMkgkZ32dAPUq3NY9' target='_blank' rel='noopener noreferrer'>Cómo llegar</a>
                </div>
            </div>

            <div className='section us_section'>
                <h2 className='section_title reverse'>Nosotros</h2>                
                <p>En Arepas Tío Lucho, nos apasiona brindarte una experiencia única y auténtica. Con años de experiencia en la industria, nuestro equipo de talentosos amantes de las arepas trabaja incansablemente para ofrecerte los sabores más exquisitos y una atención excepcional. <br /><br />
                    Creemos en la importancia de preservar la tradición culinaria y resaltar los ingredientes frescos y de alta calidad que hacen que nuestras arepas sean inigualables. Cada arepa que servimos es cuidadosamente preparada con pasión y creatividad, para brindarte una explosión de sabores en cada bocado.
                </p>
                <Button type='button' name='Domicilios' icon='next' onClick={handleclickDeliveries} template='dark' />
            </div>      

            <div className='section contact_section'>
                <h2 className='section_title'>Contacto</h2>
                <ContactForm />
            </div>
            
            <Footer />
        </div>
    );
}

export { LandingPage };