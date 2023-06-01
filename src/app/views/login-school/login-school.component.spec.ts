import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSchoolComponent } from './login-school.component';

describe('LoginSchoolComponent', () => {
  let component: LoginSchoolComponent;
  let fixture: ComponentFixture<LoginSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSchoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
