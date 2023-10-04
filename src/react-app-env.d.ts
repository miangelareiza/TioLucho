/// <reference types="react-scripts" />

declare module 'uuid';
declare module 'react-qr-scanner';
declare module '*.wav';
declare module 'html2pdf.js';

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