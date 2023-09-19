import { useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Components
import { useAppStates } from '../helpers/states';
import { valueToCurrency } from '../helpers/functions';
import { Map } from './Map';
// Styles
import '../styles/Input.css'
// Sources
import { Autocomplete } from '@react-google-maps/api';

interface TypePhotoProps {
	id: string;
	value: string | null;
	setValue: React.Dispatch<React.SetStateAction<string | null>>;
	name: string;
	required: boolean;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TypePhoto({ id, value, setValue, name, required, disabled, onChange }: TypePhotoProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClickImageContainer = useCallback(() => {
		(inputRef.current as HTMLInputElement).click();
	}, []);

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		const file = (e.currentTarget.files as FileList)[0]

		if (!file) {
			setValue(null);
			return;
		}

		const reader = new FileReader();

		reader.onload = function(event) {
			const image = new Image();
			image.onload = () => {
				const width = image.width;
				const height = image.height;
				// Calcular el tamaño del cuadrado
				const size = Math.min(width, height);
				// Crear un lienzo de imagen cuadrada
				const canvas = document.createElement('canvas');
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext('2d');
				// Manejar un error si no se pudo obtener el contexto del lienzo
				if (!ctx) {
					setValue(null);
					return;
				}
				// Calcular las coordenadas de recorte
				const x = width > height ? (width - size) / 2 : 0;
				const y = height > width ? (height - size) / 2 : 0;
				// Recortar y redimensionar la imagen en el lienzo
				ctx.drawImage(image, x, y, size, size, 0, 0, size, size);
				// Obtener el archivo de imagen en formato blob
				canvas.toBlob((blob) => {
					if (blob) {
						const newFile = new File([blob], file.name, { type: 'image/jpeg' });
						setValue(URL.createObjectURL(newFile));
					}
				}, 'image/jpeg', 0.9);
			};
			image.src = event.target?.result as string
		};

		reader.readAsDataURL(file);

        if (onChange) onChange(e);
	}, [onChange, setValue])

	return(
		<>
			<div className='image_body'>
				<div className='image_container' id={id+'_imageContainer'} onClick={handleClickImageContainer}>
					{value && <img className='uploaded_image' src={value} alt='Imagen seleccionada' width='210px' height='210px' />}
				</div>
				<p className='image_description'>Tamaño recomendado (300x300). Formatos (JPG, JPEG, PNG).</p>
			</div>
			<div className='input_field'>
				<label className='field_name' htmlFor={id} >{name}</label>
				<input
					className='field_type_input'
					id={id}
					name={name.replaceAll(' ','-')}
					type='file'
					onChange={handleChange}
					accept='image/png, image/jpg, image/jpeg'
					required={required}
					disabled={disabled}
					ref={inputRef}
				/>
			</div>
		</>
	)
}

interface TypeSelectProps {
	id: string;
	value: SelectOption | null;
	setValue: React.Dispatch<React.SetStateAction<SelectOption | null>>;
	name: string;
	required: boolean;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	options: Array<SelectOption>;
	defaultValue?: string
	isSearchable?: boolean
	isMultiSelect?: boolean
}

function TypeSelect({id, value, setValue, name, required, disabled, onChange, options, defaultValue, isSearchable, isMultiSelect}: TypeSelectProps) {
	const menuPortalTarget = document.body;
	const [newValue, setNewValue] = useState<SelectOption | null>(null);

	const styles = {
		control: (provided: any) => ({
			...provided,
			width: '100%',
			height: '56px',
			background: 'var(--inputs)',
			color: 'var(--dark)',
			border: 'none',
			boxShadow: 'none',
			outline: 'none',
			borderRadius: '2vh',
			textAlign: 'center',
			fontSize: '1rem',
			padding: '0 2vh',
			display: 'flex'
		}),
	};	

	useEffect(() => {
		if (defaultValue) {
			const filterValue = options.filter((opt: SelectOption) => opt.value === defaultValue)[0];
			setNewValue(filterValue);
			setValue(filterValue);
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValue]);

	const handleChange = useCallback((e: any)=>{
		if (!e) e = [];
		setValue(e);

        if (onChange) onChange(e);
	}, [setValue, onChange]);

	return(
		<div className='input_field'>
			<label className='field_name' htmlFor={id} >{name}</label>
			<Select
				styles={styles}
				inputId={id}
				name={name.replaceAll(' ', '-')}
				value={value}
				defaultValue={newValue}
				options={options}
				onChange={handleChange}
				isSearchable={isSearchable}
				isDisabled={disabled}
				isMulti={isMultiSelect}
				isClearable
				required={required}
				placeholder={name}
				noOptionsMessage={() => `Sin resultados de ${name}`}
				closeMenuOnSelect={isMultiSelect ? false : true}
				tabSelectsValue
				menuPortalTarget={menuPortalTarget}
			/>
		</div>
	)
}

interface TypeGeolocationProps {
	id: string;
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	name: string;
	required: boolean;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TypeGeolocation({id, value, setValue, name, required, disabled, onChange}: TypeGeolocationProps) {
	const { apiMapsIsLoaded } = useAppStates();
    const [centerMap, setCenterMap] = useState<{lat: number, lng: number}>();
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Autocomplete>();

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e)=>{		
		setValue(e.currentTarget.value);

        if (onChange) onChange(e);
	}, [setValue, onChange]);

	const toggleMap = () => {
		(document.querySelector('.container_map') as HTMLDivElement).classList.toggle('active');
	}

	const handleLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        setSelectedPlace(autocomplete);
    };

    const handleChangeAutocomplete = useCallback(() => {
        if (selectedPlace) {
            const place = selectedPlace.getPlace();
            const address = place.formatted_address || '';
            setValue(address);

            if (!address) {
				setCenterMap({lat: 0, lng: 0});
				return;
			}

			const geocoder = new window.google.maps.Geocoder();
			geocoder.geocode({ address }, (results, status) => {
				if (status === 'OK' && results && results.length > 0) {
					const { lat, lng } = results[0].geometry.location;
					setCenterMap({ lat: lat(), lng: lng() });
				} else {
					console.error('Geocode was not successful for the following reason: ', status);
				}
			});
        }
    }, [selectedPlace, setValue]);

	return(
		<div className='input_field'>
			<label className='field_name' htmlFor={id} >{name}</label>
			{apiMapsIsLoaded && 
			<Autocomplete className='field_type_geolocation' onLoad={handleLoadAutocomplete} onPlaceChanged={handleChangeAutocomplete} >
				<>
					<input
						className='field_type_input'
						id={id}
						name={name.replaceAll(' ','-')}
						type='text'
						onChange={handleChange}
						value={value}
						placeholder={name}
						required={required}
						disabled={disabled}
					></input>
					<FaMapMarkerAlt size={23} className='field_icon_geolocation' onClick={toggleMap} />
					<div className='container_map'>
						<Map 
							center={centerMap}
							setCenter={setCenterMap}
							address={value}
							setAddress={setValue}
							className='inputs'
							clickable={true}
						/>
					</div>
				</>
			</Autocomplete>}
		</div>
	)
}

interface TypeTextAreaProps {
	id: string;
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	name: string;
	required: boolean;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TypeTextArea({id, value, setValue, name, required, disabled, onChange}: TypeTextAreaProps) {

	const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e)=>{		
		setValue(e.currentTarget.value);

        if (onChange) onChange(e);
	}, [setValue, onChange]);

	return(		
		<div className='input_field'>
			<label className='field_name' htmlFor={id} >{name}</label>
			<textarea
				className='field_type_textarea'
				id={id}
				name={name.replaceAll(' ', '-')}
				onChange={handleChange}
				value={value}
				placeholder={name}
				required={required}
				disabled={disabled}
			></textarea>
		</div>
	)
}

interface TypeBasicProps {
	id: string;
	value: string | number | boolean;
	setValue: React.Dispatch<React.SetStateAction<string | number | boolean>>;
	name: string;
	required: boolean;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	autoComplete?: string;
	min?: number;
	max?: number;
	type: string
}

function TypeBasic({id, value, setValue, name, required, disabled, onChange, autoComplete, min, max, type}: TypeBasicProps) {
	const [subType, setSubType] = useState<string>(type);

	useEffect( () => {
		if (type === 'money' && (typeof(value) === 'string' || typeof(value) === 'number')) {
			setValue(valueToCurrency(value));
			setSubType('text')
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e)=>{		
		if (type === 'money' && (typeof(value) === 'string' || typeof(value) === 'number')) {	
			setValue(valueToCurrency(value));
		} else if (type === 'checkbox') {
			setValue(e.currentTarget.checked)
		} else {
			setValue(e.currentTarget.value);
		}

        if (onChange) onChange(e);
	}, [type, value, setValue, onChange]);

	return(		
		<div className='input_field'>
			<label className='field_name' htmlFor={id} >{name}</label>
			<div className={subType === 'checkbox'?'field_type_slider':''}>
				<input
					className={subType !== 'checkbox'?'field_type_input':''}
					id={id}
					name={name.replaceAll(' ','-')}
					type={type}
					onChange={handleChange}
					value={subType !== 'checkbox' && typeof(value) !== 'boolean' ? value : undefined}
					checked={subType === 'checkbox' && typeof(value) === 'boolean' ? value : undefined}                
					placeholder={name}
					required={subType === 'checkbox'? false : required}
					disabled={disabled}
					autoComplete={autoComplete}
					min={min}
					max={max}
				/>
				{subType === 'checkbox' && <label htmlFor={id}></label>}
			</div>
		</div>
	)
}

interface InputProps {
	type: 'text' | 'number' |'checkbox' | 'date' | 'time' | 'email' | 'tel' | 'password' | 'money' | 'photo' | 'select' | 'geolocation' | 'textarea';
	value: any;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	name: string;
	required?: boolean;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent) => void;
	autoComplete?: string;
	min?: number;
	max?: number;
	options?: Array<SelectOption>;
	isMultiSelect?: boolean;
	defaultValue?: string;
	isSearchable?: boolean;
}

function Input({ type, name, value, setValue, onChange, required = true, disabled, autoComplete = 'off', min, max, options, isMultiSelect, defaultValue, isSearchable = true }: InputProps) {
	const { newId } = useAppStates();
	const basicTypes = ['text', 'number','checkbox', 'date', 'time', 'email', 'tel', 'password', 'money'];
	
    return (
		<>{
			type === 'photo' ?
				<TypePhoto id={newId()} value={value} setValue={setValue} name={name} required={required} disabled={disabled} onChange={onChange} />
			: type === 'select' && options ?
				<TypeSelect id={newId()} value={value} setValue={setValue} name={name} required={required} disabled={disabled} onChange={onChange} options={options} defaultValue={defaultValue} isSearchable={isSearchable} isMultiSelect={isMultiSelect} />
			: type === 'geolocation' ?
				<TypeGeolocation id={newId()} value={value} setValue={setValue} name={name} required={required} disabled={disabled} onChange={onChange} />
			: type === 'textarea' ?
				<TypeTextArea id={newId()} value={value} setValue={setValue} name={name} required={required} disabled={disabled} onChange={onChange} />
			: basicTypes.includes(type) ?
				<TypeBasic id={newId()} value={value} setValue={setValue} name={name} required={required} disabled={disabled} onChange={onChange} autoComplete={autoComplete} min={min} max={max} type={type} />
			:
				null
		}</>
    );	
}

export { Input };