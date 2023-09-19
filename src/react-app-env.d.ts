/// <reference types="react-scripts" />

declare module 'uuid'

interface ResponseApi {
    rpta: string
    cod: string
}

interface SelectOption {
	value: string;
	label: string;
	complete: object;
}

interface SelectGroupOption{
	label: string;
	options: Array<SelectOption>;
}