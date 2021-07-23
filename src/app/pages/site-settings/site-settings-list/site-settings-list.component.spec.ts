import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSettingsListComponent } from './site-settings-list.component';

describe('SiteSettingsListComponent', () => {
  let component: SiteSettingsListComponent;
  let fixture: ComponentFixture<SiteSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteSettingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
