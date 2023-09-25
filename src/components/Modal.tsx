import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';

// Styles
import '../styles/Modal.css';

interface Props {
    children: React.ReactNode
    name: string
    closeUrl: string
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function Modal({children, name, closeUrl, isOpen, setIsOpen}: Props) {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState<boolean>(false);
    const modalRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (isOpen) setActiveModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setActiveModal(false);
        setTimeout(() => {
            setIsOpen(false);
            if (closeUrl) navigate(closeUrl);
        }, 700);
    }, [setIsOpen, closeUrl, navigate]);

    const handleClickWrapper: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (e.target instanceof HTMLElement && e.target.nodeName !== 'DIV') return;
        
        if (modalRef.current && e.target instanceof HTMLElement && e.target.className.includes('modal_wrapper')) {
            let modal = modalRef.current as HTMLElement;
            modal.classList.add('animate');
            setTimeout(() => {
                modal.classList.remove('animate');
            }, 1000);
        }
    }, [])

    return isOpen ? ReactDOM.createPortal(
        <div className='modal_wrapper' onClick={handleClickWrapper}>
            <div className={`modal_container ${activeModal ? 'active' : ''}`} ref={modalRef}>
                <TiDelete className='modal_button' onClick={handleClose} />
                <h4 className='modal_header'>
                    {name}
                </h4>
                <div className='modal_body'>
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')!
    ) : null;
}

export { Modal }