import { useEffect } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
// Styles
import '../styles/Home.css';
// Sources
import imgDefaultUser from '../assets/images/DefaultUser.svg';

function Home() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const { user, path } = useAuth();
    const imgPath = user?.imageUrl ? `${path}AssetsImage/${user.imageUrl}` : imgDefaultUser;
    const welcomeMessage = `Bienvenid${user?.gender === 'Hombre' ? 'o' : 'a'}`;

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            home: true,
            option: 'home'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='page_container'>
            <Header />
            <h2 className='welcome_user'>{welcomeMessage}<br/>{user?.name}</h2>
            <div className='user_image'>
                <img src={imgPath} alt='Imagen del usuario el piloncito' />
            </div>
        </div>
    );
}

export { Home };