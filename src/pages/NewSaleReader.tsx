import { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';

// Components
import { useAppStates } from '../helpers/states';

function NewSaleReader() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const [result, setResult] = useState(null);
  
    const handleScan = (data: any) => {
        if (data) {
            setResult(data.text);
        }
    };
  
    const handleError = (err: any) => {
        console.error(err);
    };

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            active: false
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            <QrReader
                delay={300} // Intervalo de escaneo en milisegundos
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            {result && <p>Resultado: {result}</p>}
        </>
    );
}

export { NewSaleReader };