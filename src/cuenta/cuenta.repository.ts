import { Repository } from "../shared/repository.js";
import { cuenta } from "./cuenta.entity.js";

const cuentas = [
    new cuenta (
        100,
        'cuenta1@gmail.com',
        'CuentaPrueba',
        'admin',
        'Cuenta para el testeo de la app',
        20,
    ),
]

export class CuentaRepository implements Repository<cuenta>{
    public findAll(): cuenta[] | undefined{
        return cuentas
    }

    public findOne(item: { id: number; }): cuenta | undefined {
        return cuentas.find((cuenta)=>cuenta.id === item.id)
    }

    public add(item: cuenta): cuenta | undefined {
        cuentas.push(item)
        return item
    }

    public update(item: cuenta): cuenta | undefined {
        const cuentaIDx = cuentas.findIndex((cuenta) => cuenta.id === item.id)
        if(cuentaIDx !== -1){
            cuentas[cuentaIDx] = { ...cuentas[cuentaIDx], ...item }
        }
        return cuentas[cuentaIDx] 
    }

    public delete(item: { id: number; }): cuenta | undefined {
              const cuentaIDx = cuentas.findIndex((cuenta) => cuenta.id === item.id)
    if(cuentaIDx !== -1) {
        const deletedCuentas = cuentas[cuentaIDx]
        cuentas.splice(cuentaIDx, 1)
        return deletedCuentas
        }
    }
}