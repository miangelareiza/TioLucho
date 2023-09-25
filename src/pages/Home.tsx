import { useEffect } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Styles
import '../styles/Home.css';

function Home() {
    const { setIsLoading, setMenuConfig } = useAppStates();

    useEffect(() => {
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