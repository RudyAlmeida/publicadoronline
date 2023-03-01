import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { LoginComponent } from './views/login/login.component';
import { DashboadComponent } from './views/dashboad/dashboad.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt'
import { ToastrModule } from 'ngx-toastr';
import { RoundPipe, MinutesToHours } from './services/registries.service';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { TotalsComponent } from './components/totals/totals.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ContactsComponent } from './views/contacts/contacts.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CongregationComponent } from './views/congregation/congregation.component';
import { LoginCongregationComponent } from './views/login-congregation/login-congregation.component';
import { LoginContactsComponent } from './views/login-contacts/login-contacts.component'
import { InputTextModule } from 'primeng/inputtext';


registerLocaleData(localeBr, 'pt')
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboadComponent,
    FooterComponent,
    HeaderComponent,
    RoundPipe,
    MinutesToHours,
    TotalsComponent,
    PerfilComponent,
    ContactsComponent,
    CongregationComponent,
    LoginCongregationComponent,
    LoginContactsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    SocialLoginModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    FormsModule,
    NgbModalModule,
    ToastrModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleLogin
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class DemoModule extends CalendarNativeDateFormatter {
  public override weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }
}
