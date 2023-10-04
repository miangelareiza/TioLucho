import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-scanner';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
// Sources
import AudioQR from '../assets/sounds/barcode.wav';

function NewSaleReader() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const navigate = useNavigate();    
    const [cameraId, setCameraId] = useState('');
    const [devices, setDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const [prevScan, setPrevScan] = useState('');

    useEffect(() => {
        handleCamera();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'sale'
        });
        
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                setDevices(videoDevices);
                
                if (videoDevices.length > 1) {
                    setCameraId(videoDevices[1].deviceId);
                } else {
                    setCameraId(videoDevices[0].deviceId);
                }
                setTimeout(() => {
                    setLoadingDevices(false);
                }, 500);
            } else {
                addToastr('Tu dispositivo no cuenta con dispositivos de video', 'info');
                navigate('/home');
            }
        } catch (error: any) {
            if (error.name === 'NotAllowedError') {
                addToastr('Permiso denegado para acceder a la cámara', 'info');
            } else if (error.name === 'NotFoundError') {
                addToastr('No se encontraron dispositivos de cámara', 'info');
            } else {
                addToastr('Error al obtener permiso para los dispositivos de video', 'info');
            }    
            navigate('/home');
        }
    };

    const handleCameraChange = (event: any) => {
        const selectedCameraId = event.target.value;
        setCameraId(selectedCameraId);
    };

    const handleScan = (data: any) => {
        if (data) {
            if (data.text !== prevScan) {
                const audio = new Audio(AudioQR);
                audio.play();                
                setPrevScan(data.text);

                if (!data.text.includes('https://tiolucho.com/#/home/newSale/') || !data.text.split('/')[6]) {
                    addToastr('Cliente no valido');
                } else {
                    navigate(data.text.split('/')[6]);
                }
            }
        }
    };

    const handleError = (err: any) => {
        addToastr(err, 'error');
    };

    return (
        <div className='container_qr_reader'>
            <Header />
            <h3>Lector</h3>

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
            <button 
                style={{position: 'absolute'}}
                onClick={()=>{
                    setLoadingDevices(true);
                    handleCamera();
                }}
            >Reload</button>

            <div className='qrReader'>
                { !loadingDevices &&
                    <QrReader
                        delay={500}
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