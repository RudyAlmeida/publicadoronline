import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsGuard } from './guards/contacts.guard';
import { LoginGuard } from './guards/login.guard';
import { SuperGuard } from './guards/super.guard';
import { CongregationComponent } from './views/congregation/congregation.component';
import { ContactsComponent } from './views/contacts/contacts.component';
import { DashboadComponent } from './views/dashboad/dashboad.component';
import { LoginCongregationComponent } from './views/login-congregation/login-congregation.component';
import { LoginContactsComponent } from './views/login-contacts/login-contacts.component';
import { LoginSchoolComponent } from './views/login-school/login-school.component';
import { LoginComponent } from './views/login/login.component';
import { SchoolComponent } from './views/school/school.component';
import { CarrinhoComponent } from './views/carrinho/carrinho.component';

const routes: Routes = [
  {path:'', redirectTo:'/relatorio', pathMatch:'full'},
  { path: 'login', component: LoginComponent },
  { path: 'relatorio', component: DashboadComponent, canActivate: [LoginGuard] },
  { path: 'congregacao/login', component: LoginCongregationComponent },
  { path: 'congregacao', component: CongregationComponent, canActivate: [SuperGuard] },
  { path: 'contatos', component: ContactsComponent, canActivate: [ContactsGuard] },
  { path: 'contatos/login', component: LoginContactsComponent },
  { path: 'escola/login', component: LoginSchoolComponent },
  { path: 'escola', component: SchoolComponent, canActivate: [ContactsGuard] },
  { path: 'carrinho', component: CarrinhoComponent, canActivate: [ContactsGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
