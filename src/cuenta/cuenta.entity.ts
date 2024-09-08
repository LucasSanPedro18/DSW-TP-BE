export class cuenta{
    constructor(
        public idCuenta:number,
        public mail:string,
        public nombre:string,
        public contraseña:string,
        public descripcion:string,
        public foto:number, //Uint8Array Tipo de dato??
    ) {}
}