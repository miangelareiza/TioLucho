// Sources
import imgDefaul from '../assets/images/Logo.png'
import { Avatar, Button, Input, Space, Tooltip } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

const valueToCurrency = (value: string | number): string => {
    const cleanValue = value.toString().replace(/[^0-9]/g, '');
    const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return formattedValue;
};

const formatDateTime = (datetime: string) => {
    const newDateTime = new Date(datetime).toLocaleString('en-US');
    const formatedValue = newDateTime.replace(/:\d{2}(?=\s[A|P]M$)/, '').split(', ');
    return {date: formatedValue[0], time: formatedValue[1]};
}

function isValidData(data: any) {
    if (!Array.isArray(data)) 
        return false;

    for (const item of data)
        if (!item.hasOwnProperty('Id') || !item.hasOwnProperty('Name')) 
            return false;
    
    return true;
}

const transformToOptions = (options: Array<any>): Array<SelectOption> => {
    if (!isValidData(options)) {
        return options;
    }
    
    return options.map( option => {
        return {
            value: option.Id,
            label: option.Name,
            complete: option
        };
    });
};

function setCookie(name: string, value: string | number | boolean, daysToExpire: number) {
	var expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + daysToExpire);

	var cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString();
	document.cookie = name + "=" + cookieValue;
}

function getCookie(name: string) {
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i].trim();
		if (cookie.startsWith(name + '=')) {
			return decodeURIComponent(cookie.substring(name.length + 1));
		}
	}
	return null;
}

function deleteCookie(name: string) {
    // Establece la fecha de expiración en el pasado (1 de enero de 1970)
    var expirationDate = new Date(0).toUTCString();
    document.cookie = name + "=; expires=" + expirationDate;
}

const getTableColumnProps = (dataIndex: any, searchInput: React.RefObject<InputRef>, searchedColumn: string, setSearchedColumn: React.Dispatch<React.SetStateAction<string>>, formatValue?: 'money' | 'date' | 'photo'): ColumnType<any> => ({
    dataIndex: dataIndex,
    key: dataIndex,
    ellipsis: { 
        showTitle: true 
    },
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
                ref={searchInput}
                placeholder={`Buscar ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => {confirm(); setSearchedColumn(dataIndex)}}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button 
                    type='primary' 
                    onClick={() => {confirm(); setSearchedColumn(dataIndex)}} icon={<SearchOutlined />} 
                    size='small' 
                    style={{ width: 90 }} 
                >
                    Buscar
                </Button>
                <Button 
                    onClick={() => {clearFilters && clearFilters(); confirm({closeDropdown: false}); setSearchedColumn(dataIndex)}} 
                    size='small'
                >
                    Limpiar
                </Button>
                <Button 
                    type='link' 
                    size='small' 
                    onClick={() => close()} danger 
                >
                    cerrar
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => (
        record[dataIndex] && record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase())
    ),
    onFilterDropdownOpenChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
        }
    },
    render: (text) => (
        <Tooltip 
            placement="topLeft" 
            title={
                typeof(text) === 'boolean' ? (text ? 'Si' : 'No') :
                formatValue === 'money' ? valueToCurrency(text) :
                formatValue === 'date' ? new Date(text).toLocaleDateString() :
                formatValue === 'photo' ? <Avatar icon={<img src={text ? `https://tiolucho.somee.com/AssetsImages/${text}` : imgDefaul} alt='imagen del usuario tio lucho' />} />:
                text
            }
        >
            {searchedColumn === dataIndex ?
                <b style={{color: '#1677ff'}}>
                    {
                        typeof(text) === 'boolean' ? (text ? 'Si' : 'No') :
                        formatValue === 'money' ? valueToCurrency(text) :
                        formatValue === 'date' ? new Date(text).toLocaleDateString() :
                        formatValue === 'photo' ? <Avatar icon={<img src={text ? `https://tiolucho.somee.com/AssetsImages/${text}` : imgDefaul} alt='imagen del usuario tio lucho' />} />:
                        text
                    }
                </b>
            :
                typeof(text) === 'boolean' ? (text ? 'Si' : 'No') :
                formatValue === 'money' ? valueToCurrency(text) :
                formatValue === 'date' ? new Date(text).toLocaleDateString() :
                formatValue === 'photo' ? <Avatar icon={<img src={text ? `https://tiolucho.somee.com/AssetsImages/${text}` : imgDefaul} alt='imagen del usuario tio lucho' />} />:
                text
            }
        </Tooltip>
    )
});

export { valueToCurrency, formatDateTime, transformToOptions, setCookie, getCookie, deleteCookie, getTableColumnProps };