import { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';

// Components
import { useAppStates } from '../helpers/states';

function NewSaleReader() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const [result, setResult] = useState(null);
    
    const [cameraId, setCameraId] = useState<any>(undefined);
    const [devices, setDevices] = useState<any>([]);
    const [loading, setLoading] = useState<any>(true);

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

        const selectCamera = async () => {
            try {
              const devices = await navigator.mediaDevices.enumerateDevices();
              const videoDevices = devices.filter((device) => device.kind === 'videoinput');
              setDevices(videoDevices);
      
              if (videoDevices.length > 0) {
                setCameraId(videoDevices[0].deviceId); // Puedes seleccionar aquí la cámara predeterminada
              }
            } catch (error) {
              console.error('Error al obtener los dispositivos de video:', error);
            } finally {
              setLoading(false);
            }
          };
      
          selectCamera();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCameraChange = (event: any) => {
        const selectedCameraId = event.target.value;
        setCameraId(selectedCameraId);
      };
    

    return (
        <>
            {loading ? (
                <p>Cargando dispositivos...</p>
            ) : (
                <select value={cameraId} onChange={handleCameraChange}>
                {devices.map((device: any) => (
                    <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Cámara ${device.deviceId}`}
                    </option>
                ))}
                </select>
            )}
            <QrReader
                delay={500} // Intervalo de escaneo en milisegundos
                onError={handleError}
                onScan={handleScan}
                style={{ width: '500px'}}
                constraints={cameraId && { audio: false, video: { deviceId: cameraId } }}
            />
            {result && <p>Resultado: {result}</p>}
        </>
    );
}

export { NewSaleReader };