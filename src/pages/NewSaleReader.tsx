import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-scanner';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';

function NewSaleReader() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const navigate = useNavigate();    
    const [cameraId, setCameraId] = useState('');
    const [devices, setDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [loadingDevices, setLoadingDevices] = useState(true);

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'sale'
        });
        
        setTimeout(() => {
            setIsLoading(false);
            selectCamera();      
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectCamera = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setDevices(videoDevices);

            if (videoDevices.length > 1) {
                setCameraId(videoDevices[1].deviceId);
            } else {
                setCameraId(videoDevices[0].deviceId);
            }
        } catch (error) {
            console.error('Error al obtener los dispositivos de video:', error);
            alert('error en los dispositivos de video')
        } finally {
            setLoadingDevices(false);
        }
    };

    const handleCameraChange = (event: any) => {
        const selectedCameraId = event.target.value;
        setCameraId(selectedCameraId);
    };    

    const handleScan = (data: any) => {
        if (data) {
            if (!data.text.includes('https://tiolucho.com/#/home/newSale/') || !data.text.split('/')[6]) {
                addToastr('Cliente no valido');                
                return;
            }
            navigate(data.text.split('/')[6]);
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    return (
        <div className='container_qr_reader'>
            <Header />
            <h3>Lector QR</h3>

            <div className='device_selector'>
                { !loadingDevices &&
                    <select value={cameraId} onChange={handleCameraChange}>
                        {devices.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Cámara ${device.deviceId}`}
                            </option>
                        ))}
                    </select>
                }
            </div>

            <div className='qrReader'>
                { !loadingDevices &&
                    <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        constraints={{ audio: false, video: { deviceId: cameraId }}}
                    />
                }
            </div>
        </div>
    );
}

export { NewSaleReader };