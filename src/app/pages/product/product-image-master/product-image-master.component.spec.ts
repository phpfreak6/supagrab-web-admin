import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageMasterComponent } from './product-image-master.component';

describe('ProductImageMasterComponent', () => {
  let component: ProductImageMasterComponent;
  let fixture: ComponentFixture<ProductImageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductImageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
