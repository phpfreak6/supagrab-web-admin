import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponMasterComponent } from './coupon-master.component';

describe('CouponMasterComponent', () => {
  let component: CouponMasterComponent;
  let fixture: ComponentFixture<CouponMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
