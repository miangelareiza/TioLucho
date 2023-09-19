
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

export { valueToCurrency, formatDateTime, transformToOptions };