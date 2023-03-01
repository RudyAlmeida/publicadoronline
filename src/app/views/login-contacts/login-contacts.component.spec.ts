import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginContactsComponent } from './login-contacts.component';

describe('LoginContactsComponent', () => {
  let component: LoginContactsComponent;
  let fixture: ComponentFixture<LoginContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
