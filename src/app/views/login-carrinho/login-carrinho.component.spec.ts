import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCarrinhoComponent } from './login-carrinho.component';

describe('LoginCarrinhoComponent', () => {
  let component: LoginCarrinhoComponent;
  let fixture: ComponentFixture<LoginCarrinhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCarrinhoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCarrinhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
