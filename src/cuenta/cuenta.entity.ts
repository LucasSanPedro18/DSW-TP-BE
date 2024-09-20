export class cuenta{
    constructor(
        public nombre:string,
        public contrasenia:string,
        public mail:string,
        public descripcion:string,
        public foto:number,
        public id?:number,
    ) {}
}