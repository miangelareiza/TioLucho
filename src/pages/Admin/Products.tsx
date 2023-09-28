import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Outlet, useNavigate } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
import { FaDeleteLeft } from 'react-icons/fa6';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { getTableColumnProps } from '../../helpers/functions';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';
import { Table, InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Product {
    Id: string
    Category: string
    Name: string
    Cost: number | string
    Price: number | string
    Active: boolean
}

interface GetProductsData {
    products: Array<Product>;
    cod: string;
}

function Products() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [products, setProducts] = useState<Array<Product>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedTiDelete = memo(TiDelete);
    const MemoizedEdit = memo(BiSolidMessageSquareEdit);
    const MemoizedDelete = memo(FaDeleteLeft);

    const getProducts = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetProductsData = await getApiData('Product/GetProducts', true);
            if (!data.products.length) {
                addToastr('Registra tu primer producto', 'info');
            }
            setProducts(data.products);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            path: '/home/admin',
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);
    
    const columns: ColumnsType<Product> = [
        { 
            title: 'Nombre', 
            width: 140,
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Costo', 
            width: 100,
            ...getTableColumnProps('Cost', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Precio', 
            width: 100,
            ...getTableColumnProps('Price', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Categoría', 
            width: 100,
            ...getTableColumnProps('Category', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Activo', 
            width: 100,
            ...getTableColumnProps('Active', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Acciones', 
            width: 110,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedEdit size={30} color='var(--principal)' onClick={()=> handleEditProduct(value.Id)} />
                    <MemoizedDelete size={30} color='var(--tertiary)' onClick={()=> handleDeleteProduct(value.Id)} />
                </div>
            )
        }
    ];

    const handleAddProduct = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditProduct = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteProduct = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--tertiary);'>Eliminar</b> el producto?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--tertiary)',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            try {
                const body = { 'Product_Id': id};
                const data: ResponseApi = await postApiData('Product/DeleteProduct', body, true, 'application/json');
                setProducts(prevProducts => prevProducts.filter(product => product.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    return (
        <>
            <Header />
            <TitlePage image='products' title='Productos' />

            <Button name='Agregar producto' type='button' onClick={handleAddProduct} icon='add' template='dark' />
            
            <Table 
                rowKey={record => record.Id}
                dataSource={products}
                columns={columns}
                scroll={{x: 650}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 20, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />

            <Outlet />
        </>
    );
}

export { Products };