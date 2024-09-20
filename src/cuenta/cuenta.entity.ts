export class Cuenta{
    constructor(
        public nombre:string,
        public contraseña:string,
        public mail:string,
        public descripcion:string,
        public foto:number,
        public id?:number,
    ) {}
}