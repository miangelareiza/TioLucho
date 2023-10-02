import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { FormForContact } from '../components/FormForContact';
import { Footer } from '../components/Footer';
// Styles
import '../styles/LandingPage.css';
// Sources
import imgBanner from '../assets/images/Logo.png';

function LandingPage() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const navigate = useNavigate();

    // if ("geolocation" in navigator) {
    //     var options = {
    //         enableHighAccuracy: true, // Habilita la precisión alta si está disponible
    //         maximumAge: 0, // No utilizar la ubicación en caché
    //         timeout: 5000 // Tiempo máximo de espera para obtener la ubicación
    //     };
        
    //     var watchId = navigator.geolocation.watchPosition(function (position) {
    //         var latitude = position.coords.latitude;
    //         var longitude = position.coords.longitude;
            
    //         // Aquí puedes utilizar las coordenadas de latitud y longitud en tiempo real
    //         console.log("Latitud: " + latitude);
    //         console.log("Longitud: " + longitude);
    //     }, function (error) {
    //         console.error("Error al obtener la ubicación: " + error.message);
    //     }, options);
    // } else {
    //     alert("La geolocalización no está disponible en este navegador.");
    // }

    useEffect( () => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FEFEFE');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#FEFEFE');
        
        setMenuConfig({
            active: false
        });
        setTimeout(() => {
            setIsLoading(false);
            addToastr('Bienvenido');
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

    return (
        <>
            <Header isLandingPage />

            <div className='section home_section'>
                <div>
                    <img src={imgBanner} alt='Banner inicio arepas Tío Lucho' width='350px' />
                    <div className='principal_actions'>
                        <Button type='button' name='Aliados' icon='next' onClick={()=> window.open('https://api.whatsapp.com/send?phone=573137593407&text=%C2%A1Deseo%20solicitar%20un%20pedido!')} />
                        <Button type='button' name='Domicilios' icon='next' onClick={()=> window.open('https://api.whatsapp.com/send?phone=573137593407&text=%C2%A1Deseo%20solicitar%20un%20servicio%20a%20domicilio!')} template='dark' />
                        <Button type='button' name='Embajadores' icon='next' onClick={()=> navigate('/auth/login')} />
                    </div>
                </div>
                <p>¡Bienvenidos al auténtico sabor de las arepas en su máxima expresión! <br /><br />
                    En Arepas Tío Lucho, sabemos que la verdadera esencia de nuestras arepas radica en la combinación perfecta de ingredientes frescos, sazón inigualable y la rapidez que necesitas. <br />
                    Nuestra aplicación te permitirá descubrir nuestras irresistibles arepas, desde las clásicas hasta las más creativas y llenas de sabor. Realizar tus pedidos con solo unos pocos toques ahora es posible a través de nuestra app. <br />
                    ¡Prepárate para satisfacer tus antojos y deleitarte con cada bocado de nuestras deliciosas arepas. En Arepas Tío Lucho, nos enorgullece ofrecerte autenticidad, calidad y el genuino sabor de las arepas. Ven y disfruta de una experiencia culinaria auténtica que te hará volver por más!
                </p>

                <Button type='button' name='Domicilios' icon='next' onClick={()=> window.open('https://api.whatsapp.com/send?phone=573137593407&text=%C2%A1Deseo%20solicitar%20un%20servicio%20a%20domicilio!')} />
            </div>

            <div className='section us_section'>
                <h2 className='section_title reverse'>Nosotros</h2>                
                <p>En Arepas Tío Lucho, nos apasiona brindarte una experiencia única y auténtica. Con años de experiencia en la industria, nuestro equipo de talentosos amantes de las arepas trabaja incansablemente para ofrecerte los sabores más exquisitos y una atención excepcional. <br /><br />
                    Creemos en la importancia de preservar la tradición culinaria y resaltar los ingredientes frescos y de alta calidad que hacen que nuestras arepas sean inigualables. Cada arepa que servimos es cuidadosamente preparada con pasión y creatividad, para brindarte una explosión de sabores en cada bocado.
                </p>
                <Button type='button' name='Domicilios' icon='next' onClick={()=> window.open('https://api.whatsapp.com/send?phone=573137593407&text=%C2%A1Deseo%20solicitar%20un%20servicio%20a%20domicilio!')} />
            </div>      

            <div className='section contact_section'>
                <h2 className='section_title'>Contacto</h2>
                <FormForContact />
            </div>
            
            <Footer />
        </>
    );
}

export { LandingPage };