import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ModuleWithProviders } from "@angular/core"
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from "./guards/admin.guard";
import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { UpdateProductoComponent } from './components/productos/update-producto/update-producto.component';
import { InventarioProductoComponent } from './components/productos/inventario-producto/inventario-producto.component';
import { CreateCuponComponent } from './components/cupones/create-cupon/create-cupon.component';
import { IndexCuponComponent } from './components/cupones/index-cupon/index-cupon.component';
import { UpdateCuponComponent } from './components/cupones/update-cupon/update-cupon.component';
import { ConfigComponent } from './components/config/config.component';
import { VariedadProductoComponent } from './components/productos/variedad-producto/variedad-producto.component';
import { GaleriaProductoComponent } from './components/productos/galeria-producto/galeria-producto.component';
import { IndexSoftwareComponent } from './components/software/index-software/index-software.component';
import { CreateSoftwareComponent } from './components/software/create-software/create-software.component';
import { UpdateSoftwareComponent } from './components/software/update-software/update-software.component';
import { IndexDescuentoComponent } from './components/descuento/index-descuento/index-descuento.component';
import { CreateDescuentoComponent } from './components/descuento/create-descuento/create-descuento.component';
import { EditDescuentoComponent } from './components/descuento/edit-descuento/edit-descuento.component';
import { IndexContactoComponent } from './components/contacto/index-contacto/index-contacto.component';
import { ReviewsProductoComponent } from './components/productos/reviews-producto/reviews-producto.component';
import { IndexVentasComponent } from './components/ventas/index-ventas/index-ventas.component';
import { DetalleVentasComponent } from './components/ventas/detalle-ventas/detalle-ventas.component';
import { VentasSofwareComponent } from './components/ventas-sofware/ventas-sofware.component';
import { DetalleVentasSofwareComponent } from './components/detalle-ventas-sofware/detalle-ventas-sofware.component';
import { IndexCuentasComponent } from './components/cuentas/index-cuentas/index-cuentas.component';
import { CreateCuentasComponent } from './components/cuentas/create-cuentas/create-cuentas.component';
import { EditCuentasComponent } from './components/cuentas/edit-cuentas/edit-cuentas.component';

const appRoute: Routes = [

    {path: '', redirectTo: 'inicio', pathMatch: 'full'},

    {path: 'inicio', component: InicioComponent, canActivate: [AdminGuard]},

    {path: 'panel', children: [
        {path: 'clientes', component: IndexClienteComponent, canActivate: [AdminGuard]},
        {path: 'clientes/registro', component: CreateClienteComponent, canActivate: [AdminGuard]},
        {path: 'clientes/:id', component: EditClienteComponent, canActivate: [AdminGuard]},


        {path: 'productos', component: IndexProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/registro', component: CreateProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/:id', component: UpdateProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/inventario/:id', component: InventarioProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/variedades/:id', component: VariedadProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/galeria/:id', component: GaleriaProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/reviews/:id', component: ReviewsProductoComponent, canActivate: [AdminGuard]},

        {path: 'software', component: IndexSoftwareComponent, canActivate: [AdminGuard]},
        {path: 'software/registro', component: CreateSoftwareComponent, canActivate: [AdminGuard]},
        {path: 'software/:id', component: UpdateSoftwareComponent, canActivate: [AdminGuard]},

        {path: 'cupones', component: IndexCuponComponent, canActivate: [AdminGuard]},
        {path: 'cupones/registro', component: CreateCuponComponent, canActivate: [AdminGuard]},
        {path: 'cupones/:id', component: UpdateCuponComponent, canActivate: [AdminGuard]},

        {path: 'descuentos', component: IndexDescuentoComponent, canActivate: [AdminGuard]},
        {path: 'descuentos/registro', component: CreateDescuentoComponent, canActivate: [AdminGuard]},
        {path: 'descuentos/:id', component: EditDescuentoComponent, canActivate: [AdminGuard]},

        {path: 'ventas', component: IndexVentasComponent, canActivate: [AdminGuard]},
        {path: 'ventas/:id', component: DetalleVentasComponent, canActivate: [AdminGuard]},

        {path: 'ventas-software', component: VentasSofwareComponent, canActivate: [AdminGuard]},
        {path: 'ventas-software/:id', component: DetalleVentasSofwareComponent, canActivate: [AdminGuard]},

        {path: 'contactos', component: IndexContactoComponent, canActivate: [AdminGuard]},

        {path: 'cuentas', component: IndexCuentasComponent, canActivate: [AdminGuard]},
        {path: 'cuentas/registro', component: CreateCuentasComponent, canActivate: [AdminGuard]},
        {path: 'cuentas/:id', component: EditCuentasComponent, canActivate: [AdminGuard]},

        {path: 'configuraciones', component: ConfigComponent, canActivate: [AdminGuard]},
    ]},

    {path: 'login', component: LoginComponent}
]

export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);