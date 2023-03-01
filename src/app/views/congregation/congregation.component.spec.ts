import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongregationComponent } from './congregation.component';

describe('CongregationComponent', () => {
  let component: CongregationComponent;
  let fixture: ComponentFixture<CongregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongregationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
