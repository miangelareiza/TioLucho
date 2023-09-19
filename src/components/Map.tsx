import { useEffect, useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Map.css'
// Sources
import { GoogleMap, Marker } from '@react-google-maps/api';

interface Props{
    center: {lat: number, lng: number} | undefined
    setCenter?: React.Dispatch<React.SetStateAction<{lat: number, lng: number} | undefined>>
    address?: string
    setAddress?: React.Dispatch<React.SetStateAction<string>>
    onlyView?: boolean
    zoom?: number
    className: 'inputs' | 'stores'
    clickable?: boolean
    icon?: string
}

const Map = ({ center, setCenter, address, setAddress, onlyView = false, zoom = 15, className, clickable, icon }: Props) => {
    const { apiMapsIsLoaded } = useAppStates();
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect( () => {
        if (!onlyView && setCenter) {
            if (address) {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK' && results && results.length > 0) {
                        const { lat, lng } = results[0].geometry.location;
                        setCenter({ lat: lat(), lng: lng() });
                    } else {
                        console.error('Geocode was not successful for the following reason: ', status);
                    }
                });
            }
            if (!center) {
                setCenter({ lat: 6.2227608, lng: -75.5940676 });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (map) map.setZoom(15)
    }, [map, center]);

    const handleLoadMap: ((map: google.maps.Map) => void | Promise<void>) | undefined = (map) => {
        setTimeout(() => {
            setMap(map);
        }, 300);
    }

    const handleClickMap = ({latLng}: google.maps.MapMouseEvent) => {
        if (!map || !latLng || !setCenter || !setAddress) return;

        setCenter({ lat: latLng.lat(), lng: latLng.lng() });
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                setAddress(results[0].formatted_address);
                map.setZoom(15);
            } else {
                console.error('Geocode was not successful for the following reason: ', status);
            }
        });
    };

    const handleClickCenter = () => {
        if (map && center) {
            map.panTo(center);
            map.setZoom(15);
        }
    }

    return apiMapsIsLoaded ? (
        <GoogleMap
            center={center || { lat: 6.2227608, lng: -75.5940676 }}
            zoom={zoom}
            mapContainerClassName={`map_for_${className}`}
            options={{
                zoomControl: true, streetViewControl: true, mapTypeControl: true, fullscreenControl: true
            }}
            onLoad={handleLoadMap}
            onClick={clickable ? handleClickMap : undefined}
        >
            <BiCurrentLocation size={30} className='center_map_button' onClick={handleClickCenter}/>
            {map && center && <Marker position={center} icon={icon} />}
        </GoogleMap>
    ) : (
        <div style={{display:'block',width:'100%'}}>Cargando el mapa...</div>
    );
};

export { Map};