import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { useAppStates } from '../helpers/states';
import { transformToOptions } from '../helpers/functions';
import { Input } from './Input';
import { Button } from './Button';
// Sources
import Swal from 'sweetalert2';

function FormForContact() {
    const { addToastr } = useAppStates();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const typeOptions = [
        { Id: 'Pregunta', Name: 'Pregunta'},
        { Id: 'Queja', Name: 'Queja' },
        { Id: 'Reclamo', Name: 'Reclamo' },
        { Id: 'Sugerencia', Name: 'Sugerencia' }
    ]

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault(); 

        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<BsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Deseas enviar la notificación al equipo de arepas Tío Lucho?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--green)',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            addToastr('mensaje enviado correctamente');
        }
    }

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='email' value={email} setValue={setEmail} name='Email' />
            <Input type='tel' value={phone} setValue={setPhone} name='Teléfono' />
            <Input type='select' value={type} setValue={setType} name='Tipo' options={transformToOptions(typeOptions)} />
            <Input type='textarea' value={message} setValue={setMessage} name='Mensaje' /> 
            
            <Button name='Contactar' type='submit' icon='send' />
        </form>
    );
}

export { FormForContact };