import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributesListComponent } from './product-attributes-list.component';

describe('ProductAttributesListComponent', () => {
  let component: ProductAttributesListComponent;
  let fixture: ComponentFixture<ProductAttributesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAttributesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttributesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
