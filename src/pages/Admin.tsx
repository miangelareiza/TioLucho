import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
// Styles
import '../styles/Admin.css';
// Sources
import imgClients from '../assets/images/cards/Clients.svg'
import imgCategories from '../assets/images/cards/Categories.svg'
import imgProducts from '../assets/images/cards/Products.svg'
import imgRoutes from '../assets/images/cards/Routes.svg'
import imgSales from '../assets/images/cards/Sales.svg'
import imgNotSales from '../assets/images/cards/NotSales.svg'
import imgInventories from '../assets/images/cards/Inventory.svg'
import imgLiquidations from '../assets/images/cards/Liquidation.svg'
import imgUsers from '../assets/images/cards/Users.svg'
import imgMovements from '../assets/images/cards/Movements.svg'

function Admin() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const navigate = useNavigate();

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            isHome: true,
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOpt = (name: string) => {
        setIsLoading(true);
        navigate(name);
    }

    return (
        <>
            <Header />
            <TitlePage image='admin' title='Panel Admin' />
            
            <div className='adminOptions_container'>
                <div className='adminOption' onClick={() => handleClickOpt('routes')}>
                    <img src={imgRoutes} alt='Opcion de rutas' draggable='false' width='75px' />
                    <h5>Rutas</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('categories')}>
                    <img src={imgCategories} alt='Opcion de categorías' draggable='false' width='75px' />
                    <h5>categorías</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('products')}>
                    <img src={imgProducts} alt='Opcion de productos' draggable='false' width='75px' />
                    <h5>Productos</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('clients')}>
                    <img src={imgClients} alt='Opcion de clientes' draggable='false' width='75px' />
                    <h5>Clientes</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('users')}>
                    <img src={imgUsers} alt='Opcion de usuarios' draggable='false' width='75px' />
                    <h5>Usuarios</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('inventories')}>
                    <img src={imgInventories} alt='Opcion de inventarios' draggable='false' width='75px' />
                    <h5>Inventarios</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('sales')}>
                    <img src={imgSales} alt='Opcion de ventas' draggable='false' width='75px' />
                    <h5>Ventas</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('notSales')}>
                    <img src={imgNotSales} alt='Opcion de no compras' draggable='false' width='75px' />
                    <h5>No compras</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('transactions')}>
                    <img src={imgMovements} alt='Opcion de Transacciones' draggable='false' width='75px' />
                    <h5>Transacciones</h5>
                </div>
                <div className='adminOption' onClick={() => handleClickOpt('liquidations')}>
                    <img src={imgLiquidations} alt='Opcion de liquidaciones' draggable='false' width='75px' />
                    <h5>Liquidaciones</h5>
                </div>
            </div>
        </>
    );
}

export { Admin };