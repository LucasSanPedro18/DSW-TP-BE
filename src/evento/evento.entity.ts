export class evento{
    constructor(
        public idEvento : number,
        public nombre:string,
        public cuposGral:number,
        public descripcion:string,
        public fotoEvento:number, // Uint8ArrayTipo de dato??
        public fecha:string, // Date Tipo de dato??
        public hora:string, //string Tipo de dato??
    ) {}
}