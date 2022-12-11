import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './app.routing';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { SidebarComponent } from './components/usuario/sidebar/sidebar.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { RegisterComponent } from './components/register/register.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { SoftwareComponent } from './components/software/software.component';
import { DescuentoPipe } from './pipes/descuento.pipe';
import { ScrolltopComponent } from './components/scrolltop/scrolltop.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { OrdenesComponent } from './components/usuario/ordenes/ordenes.component';
import { DetalleOrdenComponent } from './components/usuario/detalle-orden/detalle-orden.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    PerfilComponent,
    SidebarComponent,
    IndexProductoComponent,
    ShowProductoComponent,
    CarritoComponent,
    RegisterComponent,
    DireccionesComponent,
    SoftwareComponent,
    DescuentoPipe,
    ScrolltopComponent,
    ContactoComponent,
    NosotrosComponent,
    OrdenesComponent,
    DetalleOrdenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
