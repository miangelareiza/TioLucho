import { useEffect } from 'react';

// Components
import { useAppStates } from '../../helpers/states';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';

function Clients() {
    const { setIsLoading, setMenuConfig } = useAppStates();

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header />
            <TitlePage image='clients' title='Clientes' />
            
        </>
    );
}

export { Clients };