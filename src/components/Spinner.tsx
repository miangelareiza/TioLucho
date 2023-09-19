// Styles
import '../styles/Spinner.css';
// Sources
import imgLogo from '../assets/images/Logo.png';

function Spinner() {
    return (
        <div className='spinner_wrap'>
            <img className='spinner_image' src={imgLogo} alt='Logotipo de El Piloncito' draggable='false' width='150px'/>
            <div className='spinner_item'>
                <div className='item'>
                    <div className='dot dot1'></div>
                    <div className='dot dot2'></div>
                    <div className='dot dot3'></div>
                    <div className='dot dot4'></div>
                    <div className='dot dot5'></div>
                </div>
            </div>        
        </div>
    );
}

export { Spinner };