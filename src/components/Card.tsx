import React from 'react';
import { TbEdit } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';
import { BiBadgeCheck } from 'react-icons/bi';
import { FaPaperPlane } from 'react-icons/fa';

// Styles
import '../styles/Card.css'
// Sources
import { valueToCurrency, formatDateTime } from '../helpers/functions';

interface BasicData {
    name: string
}

interface OrderData {
    name: string
    quantity: number
    total: string | number
    remarks: string
}

interface InvoiceData {
    id: string
    serial: number
    table: string
    waiter: string
    client: string
    total: string | number
    paymentMethod: string
    prepaid: boolean
    created: string
    remarks: string
    type: string
    packed: boolean
    details: string
}

interface CardProps {
    onEdit?: React.MouseEventHandler
    onSee?: React.MouseEventHandler
    onDelete?: React.MouseEventHandler
    type: 'basic' | 'order' | 'invoice'
    item: BasicData | OrderData | InvoiceData
}

interface BasicCardProps {
    onEdit?: React.MouseEventHandler
    onSee?: React.MouseEventHandler
    onDelete?: React.MouseEventHandler
    item: BasicData
}

interface OrderCardProps {
    onEdit?: React.MouseEventHandler
    onSee?: React.MouseEventHandler
    onDelete?: React.MouseEventHandler
    item: OrderData
}

interface InvoiceCardProps {
    onEdit?: React.MouseEventHandler
    item: InvoiceData
}

function BasicCard({onEdit, onSee, onDelete, item}: BasicCardProps) {
    return(
        <>
            <h4 className='card_title' >{item.name}</h4>
            <div className='card_options'>
                { onEdit && <TbEdit className='option_edit' onClick={onEdit} size={27} /> }
                { onSee && <BiBadgeCheck className='option_see' onClick={onSee} size={27} /> }
                { onDelete && <TiDelete className='option_delete' onClick={onDelete} size={27} /> }
            </div>
        </>
    )
}

function OrderCard({onEdit, onSee, onDelete, item}: OrderCardProps) {
    return(
        <>
            <h4 className='card_title' >{item.name}</h4>
            <h5 className='card_quantity'>x{item.quantity}</h5>
            <h6 className='card_total'>{valueToCurrency(item.total)}</h6>
            <p className='card_remarks'>{item.remarks}</p>
            <div className='card_options'>
                { onEdit && <TbEdit className='option_edit' onClick={onEdit} size={27} /> }
                { onSee && <BiBadgeCheck className='option_see' onClick={onSee} size={27} /> }
                { onDelete && <TiDelete className='option_delete' onClick={onDelete} size={27} /> }
            </div>
        </>
    )
}

function InvoiceCard({onEdit, item}: InvoiceCardProps) {
    return(
        <>
            <div className='card_options'>
                <button onClick={onEdit}>Enviar a cocina <FaPaperPlane size={17} /></button>
            </div>
            <h3 className='card_serial'>{item.type}: # {item.type[0]}-{item.serial}</h3>
            <p className='card_info'><b>Hora:</b><br /> {formatDateTime(item.created).time}</p>
            <p className='card_info'><b>Mesa:</b><br /> {item.table}</p>
            <p className='card_info'><b>Total:</b><br /> {valueToCurrency(item.total)}</p>
            <p className='card_info'><b>Atendio:</b><br /> {item.waiter}</p>
            <p className='card_info'><b>Metodo de pago:</b><br /> {item.paymentMethod}</p>
            <p className='card_info'><b>Paga al final:</b><br /> {item.prepaid ? 'Si' : 'No'}</p>
        </>
    )
}
  
function Card({ onEdit, onSee, onDelete, type, item }: CardProps) {
    return (
        <div className={`card_template ${type}`}>
            { type === 'basic' && 'name' in item ?
                <BasicCard onEdit={onEdit} onSee={onSee} onDelete={onDelete} item={item} />
            : type === 'order' && 'quantity' in item ?
                <OrderCard onEdit={onEdit} onSee={onSee} onDelete={onDelete} item={item} />
            : type === 'invoice' && 'id' in item ?
                <InvoiceCard onEdit={onEdit} item={item} />
            : null }
        </div>
    );
}

export { Card };