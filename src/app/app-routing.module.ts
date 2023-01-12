import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { DashboadComponent } from './views/dashboad/dashboad.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'relatorio', component: DashboadComponent, canActivate: [LoginGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
