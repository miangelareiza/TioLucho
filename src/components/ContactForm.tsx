import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { Input } from './Input';
import { Button } from './Button';
// Styles
import '../styles/LandingPage.css';
// Sources
import Swal from 'sweetalert2';

function ContactForm() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [headquarter, setHeadquarter] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const typeOptions: Array<SelectOption> = [
        {
            label: 'Pregunta', 
            value: 'Pregunta',
            complete: {Id: 'Pregunta', Name: 'Pregunta'}
        },
        {
            label: 'Queja', 
            value: 'Queja',
            complete: {Id: 'Queja', Name: 'Queja'}
        },
        {
            label: 'Reclamo', 
            value: 'Reclamo',
            complete: {Id: 'Reclamo', Name: 'Reclamo'}
        },
        {
            label: 'Sugerencia', 
            value: 'Sugerencia',
            complete: {Id: 'Sugerencia', Name: 'Sugerencia'}
        }
    ]
    const headquarterOptions: Array<SelectOption> = [
        {
            label: 'Belen', 
            value: 'Belen',
            complete: {Id: 'Belen', Name: 'Belen'}
        },
        {
            label: 'Santa Mónica', 
            value: 'Santa Mónica',
            complete: {Id: 'Santa Mónica', Name: 'Santa Mónica'}
        }
    ]

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault(); 

        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Deseas enviar la notificación al equipo de El Piloncito?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            alert('mensaje enviado correctamente');
        }
    }

    return (
        <form className='contact_form' onSubmit={handleSubmit}>
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='email' value={email} setValue={setEmail} name='Email' />
            <Input type='select' value={type} setValue={setType} name='Tipo' options={typeOptions} />
            <Input type='select' value={headquarter} setValue={setHeadquarter} name='Sede' options={headquarterOptions} />
            <Input type='textarea' value={message} setValue={setMessage} name='Mensaje' /> 
            <Button name='Contactar' type='submit' icon='next' />
        </form>
    );
}

export { ContactForm };