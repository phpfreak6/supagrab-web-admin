import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributesMasterComponent } from './product-attributes-master.component';

describe('ProductAttributesMasterComponent', () => {
  let component: ProductAttributesMasterComponent;
  let fixture: ComponentFixture<ProductAttributesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAttributesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttributesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
