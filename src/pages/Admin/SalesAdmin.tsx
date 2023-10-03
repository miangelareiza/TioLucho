import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { getTableColumnProps } from '../../helpers/functions';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';
// Sources
import { DownOutlined } from '@ant-design/icons';
import { Table, InputRef, Badge, Space, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Detail {
    Id: string
    Product: string
    Sale: number
    Change: number
    Total: number
}

interface Sale {
    Id: string
    Serial: number
    Client: string
    User: string
    Total: number
    Remark: string
    Created: string
    Details: Array<Detail>
}

interface GetSalesData {
    invoices: Array<Sale>;
    cod: string;
}

interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
  }
  
function SalesAdmin() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [sales, setSales] = useState<Array<Sale>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getSales = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetSalesData = await getApiData('Invoice/GetInvoices', true);
            if (!data.invoices.length) {
                addToastr('No se han creado ventas', 'info');
            }
            setSales(data.invoices);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        getSales();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            path: '/home/admin',
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const columns: ColumnsType<Sale> = [
        { 
            title: '#', 
            width: 60,
            ...getTableColumnProps('Serial', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Cliente', 
            width: 140,
            ...getTableColumnProps('Client', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Usuario', 
            width: 140,
            ...getTableColumnProps('User', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Total', 
            width: 120,
            ...getTableColumnProps('Total', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Comentarios', 
            width: 140,
            ...getTableColumnProps('Remark', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Fecha', 
            width: 180,
            ...getTableColumnProps('Created', searchInput, searchedColumn, setSearchedColumn, 'dateTime')
        }
    ];

    // const detailsColumns: ColumnsType<Detail> = [
    //     {
    //         title: 'Producto',
    //         ...getTableColumnProps('Product', searchInput, searchedColumn, setSearchedColumn)
    //     },
    //     { 
    //         title: 'Venta',
    //         ...getTableColumnProps('Sale', searchInput, searchedColumn, setSearchedColumn)
    //     },
    //     { 
    //         title: 'Cambios',
    //         ...getTableColumnProps('Change', searchInput, searchedColumn, setSearchedColumn)
    //     },
    //     { 
    //         title: 'Total',
    //         ...getTableColumnProps('Total', searchInput, searchedColumn, setSearchedColumn, 'money')
    //     }         
    // ];

    const expandedRowRender = () => {        
        const items = [
            { key: '1', label: 'Action 1' },
            { key: '2', label: 'Action 2' },
        ];
        const columns: ColumnsType<ExpandedDataType> = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Status',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: () => (
                <Space size="middle">
                    <a>Pause</a>
                    <a>Stop</a>
                    <Dropdown menu={{ items }}>
                    <a>
                        More <DownOutlined />
                    </a>
                    </Dropdown>
                </Space>
                ),
            },
        ];
    
        const data = [];
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                date: '2014-12-24 23:12:00',
                name: 'This is production name',
                upgradeNum: 'Upgraded: 56',
            });
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    return (
        <>
            <Header />
            <TitlePage image='sales' title='Ventas' />

            <Table 
                rowKey={record => record.Id}
                dataSource={sales}
                columns={columns}
                // expandable={{
                //     expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.Details.toString()}</p>                   
                // }}
                expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                scroll={{x: 680}}
                style={{marginBottom: '120px'}}
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />
        </>
    );
}

export { SalesAdmin };