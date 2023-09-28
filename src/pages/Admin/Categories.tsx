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

interface Category {
    Id: string
    Name: string
}

interface GetCategoriesData {
    categories: Array<Category>;
    cod: string;
}

function Categories() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [categories, setCategories] = useState<Array<Category>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedTiDelete = memo(TiDelete);
    const MemoizedEdit = memo(BiSolidMessageSquareEdit);
    const MemoizedDelete = memo(FaDeleteLeft);

    const getCategories = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetCategoriesData = await getApiData('Category/GetCategories', true);
            if (!data.categories.length) {
                addToastr('Registra tu primer categoria', 'info');
            }
            setCategories(data.categories);
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
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);
    
    const columns: ColumnsType<Category> = [
        { 
            title: 'Nombre', 
            width: 220,
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Acciones', 
            width: 110,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedEdit size={30} color='var(--principal)' onClick={()=> handleEditCategory(value.Id)} />
                    <MemoizedDelete size={30} color='var(--tertiary)' onClick={()=> handleDeleteCategory(value.Id)} />
                </div>
            )
        }
    ];

    const handleAddCategory = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditCategory = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteCategory = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--tertiary);'>Eliminar</b> la categoría?</div>`,
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
                const body = { 'Category_Id': id};
                const data: ResponseApi = await postApiData('Category/DeleteCategory', body, true, 'application/json');
                setCategories(prevCategories => prevCategories.filter(category => category.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    return (
        <>
            <Header />
            <TitlePage image='categories' title='Categorías' />

            <Button name='Agregar categoría' type='button' onClick={handleAddCategory} icon='add' template='dark' />
            
            <Table 
                rowKey={record => record.Id}
                dataSource={categories} 
                columns={columns}
                scroll={{x: 330}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />

            <Outlet />
        </>
    );
}

export { Categories };