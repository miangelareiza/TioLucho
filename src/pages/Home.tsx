import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';

function Home() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.roleId.toUpperCase() === 'D1141F51-D57B-4376-915D-9D45DC29078C') navigate('admin')
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            isHome: true,
            tabOption: 'home'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header />
            
        </>
    );
}

export { Home };