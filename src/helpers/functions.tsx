
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

export { valueToCurrency, formatDateTime, transformToOptions, setCookie, getCookie, deleteCookie };