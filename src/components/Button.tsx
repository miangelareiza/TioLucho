import React from 'react';
import { TiArrowForward } from 'react-icons/ti';
import { TbSquareRoundedPlusFilled } from 'react-icons/tb';
import { FaPaperPlane } from 'react-icons/fa';

// Styles
import '../styles/Button.css'

interface Props {
    name: string
    type: 'button' | 'submit' | 'reset'
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    icon?: 'next' | 'add' | 'send'
    disabled?: boolean
    template?: 'short' | 'dark' | 'gradient' | 'short dark' | 'short gradient'
}

const iconComponents = {
    next: <TiArrowForward className='button_icon' size={24} />,
    add: <TbSquareRoundedPlusFilled className='button_icon' size={22} />,
    send: <FaPaperPlane className='button_icon' size={18} />,
};

function Button({ name, type, onClick, icon, disabled, template }: Props) {
    return (
        <div className='button_container'>
            <button
                className={`button_template ${template}`}
                type={type}
                name={name.replaceAll(' ','-')}
                disabled={disabled}
                onClick={onClick}
                aria-label={name.replaceAll(' ','-')}
            >
                {name}
                {icon && iconComponents[icon]}
            </button>
        </div>
    );
}

export { Button };