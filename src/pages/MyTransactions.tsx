import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { valueToCurrency, formatDateTime } from '../helpers/functions';
import { Header } from '../components/Header';
// Styles
import '../styles/Transactions.css';
// Sources
import imgIncome from '../assets/images/icons/Income.svg';
import imgExpenses from '../assets/images/icons/Expenses.svg';
import imgMovements from '../assets/images/cards/Movements.svg';

interface Transaction {
    Id: string
    Total: number
    Remark: string
    IsIncome: boolean
    Created: string
}

interface GetTransactionsData {
    cashTransactions: Array<Transaction>;
    cod: string;
}

function MyTransactions() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);

    const getTransactions = useCallback(async () => {
        try {
            const data: GetTransactionsData = await getApiData('CashTransaction/GetCashTransactionsByUser', true);
            if (!data.cashTransactions.length) {
                addToastr('Registra tu primer movimiento', 'info');
            }
            setTransactions(data.cashTransactions);
            let inc = 0
            let exp = 0
            data.cashTransactions.forEach(({ Total, IsIncome }) => {
                if (IsIncome)
                    inc += Total;
                else
                    exp += Total;
            })
            setIncome(inc)
            setExpense(exp)
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'transactions'
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        getTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);

    const handleClickTo = useCallback(() => {
        setIsLoading(true);
    }, [setIsLoading])

    const handleShowTransactions = useCallback(() => {
        setShowTransactions(!showTransactions);
    }, [showTransactions]);

    const transactionsComponent: React.JSX.Element[] = useMemo(() => (
        transactions.map(({ Id, Total, Remark, IsIncome, Created }) => {
            return(
                <div key={Id} className={`transaction ${IsIncome ? 'income' : 'expense'}`}>
                    <span className='transaction_amount'>{valueToCurrency(Total)}</span>
                    <span className='transaction_detail'>{Remark}</span>
                    <span className='transaction_detail'>{formatDateTime(Created).complete}</span>
                </div>
            )
        })
    ), [transactions]);

    return (
        <>
            <Header />
            <div className='transactions_actions'>
                <Link to='income' onClick={handleClickTo}>
                    <img src={imgIncome} alt='Income icon' width='45px' height='45px' />
                </Link>

                <button className='cash_register'>
                    <img src={imgMovements} alt='Cash register icon' width='100px'/>
                </button>

                <Link to='expense' onClick={handleClickTo}>
                    <img src={imgExpenses} alt='Expenses icon' width='45px' height='45px' />
                </Link>
            </div>

            <div className='income_and_expense'>
                <div className='income_and_expense_container'>                    
                    <div className='income'>
                        <h3>Ingresos</h3>
                        {valueToCurrency(income)}
                    </div>
                    <div className='expense'>
                        <h3>Egresos</h3>
                        {valueToCurrency(expense)}
                    </div>
                    <button className='see_transactions' onClick={handleShowTransactions}>
                        Ver movimientos
                    </button>
                </div>
            </div>
            
            <div className={`transactions ${showTransactions ? 'active' : ''}`}>
                <div className='titles'>
                    <h2>Ingresos</h2>
                    <h2>Egresos</h2>
                </div>
                <div className='container_transactions'>
                    {transactionsComponent}
                </div>
            </div>

            <Outlet />
        </>
    );
}

export { MyTransactions };