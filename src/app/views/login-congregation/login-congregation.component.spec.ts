import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCongregationComponent } from './login-congregation.component';

describe('LoginCongregationComponent', () => {
  let component: LoginCongregationComponent;
  let fixture: ComponentFixture<LoginCongregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCongregationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCongregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
