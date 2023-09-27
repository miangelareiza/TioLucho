import React, { memo, useCallback } from 'react';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { renderToString } from 'react-dom/server';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
// Sources
import Swal from 'sweetalert2';

interface NewTransactionData {
    Total: number
    Remark: string
    IsIncome: boolean
}

function IncomeAndExpense() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = React.useState(false);
    const location = useLocation();
    const [total, setTotal] = React.useState('');
    const [remark, setRemark] = React.useState('');
    const urlName = location.pathname.split('/')[location.pathname.split('/').length -1];
    const urlSName = urlName === 'income' ? 'Ingreso' : 'Egreso'
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
            setOpenModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--principal);'>Crear</b> la ${urlSName}?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#27A64A',
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            try {
                const body: NewTransactionData = {
                    'Total': Number(total.replace(/[^0-9]/g, '')),
                    'Remark': remark,
                    'IsIncome': urlName === 'income' ? true : false
                };
                const data: ResponseApi = await postApiData('CashTransaction/CreateCashTransaction', body, true, 'application/json');
                addToastr(data.rpta);
                navigate('/home/transactions');
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }            
        }
    }, [urlSName, total, remark, urlName, postApiData, addToastr, navigate, MemoizedBsQuestionOctagonFill]);

    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/transactions' name={`Registrar ${urlSName}`}>
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input type='money' value={total} setValue={setTotal} name='Valor' />
                <Input type='textarea' value={remark} setValue={setRemark} name='Comentario' /> 

                <Button name={`Registrar ${urlSName}`} type='submit' icon='send' />
            </form>
        </Modal>
    );
}

export { IncomeAndExpense };