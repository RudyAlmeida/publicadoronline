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
import { FlatpickrModule } from 'angularx-flatpickr';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt'
import { ToastrModule } from 'ngx-toastr';
import { RoundPipe } from './services/registries.service';

registerLocaleData(localeBr, 'pt')
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboadComponent,
    FooterComponent,
    HeaderComponent,
    RoundPipe
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
    ToastrModule.forRoot()
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