// Sources
import imgAdmin from '../assets/images/cards/Admin.svg'
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

interface Props {
    image: 'admin' | 'clients' | 'categories' | 'products' |'routes' | 'sales' | 'notSales' | 'inventories' | 'liquidations' | 'users' | 'transactions' 
    title: string
}

function TitlePage({ image, title }: Props) {
    const imageUrl = {
        admin: imgAdmin,
        clients: imgClients,
        categories: imgCategories,
        products: imgProducts,
        routes: imgRoutes,
        sales: imgSales,
        notSales: imgNotSales,
        inventories: imgInventories,
        liquidations: imgLiquidations,
        users: imgUsers,
        transactions: imgMovements,
    };
    
    return(
        <>
            <img className='icon_page' src={imageUrl[image]} alt={`Icono ${title}`} draggable='false' width='80px' />
            <h3 className='title_page'>{title}</h3>
        </>
    );
}

export { TitlePage };