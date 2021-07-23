import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSettingsMasterComponent } from './site-settings-master.component';

describe('SiteSettingsMasterComponent', () => {
  let component: SiteSettingsMasterComponent;
  let fixture: ComponentFixture<SiteSettingsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteSettingsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSettingsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
