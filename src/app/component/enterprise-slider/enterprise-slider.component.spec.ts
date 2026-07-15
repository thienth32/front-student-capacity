import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseSliderComponent } from './enterprise-slider.component';

describe('EnterpriseSliderComponent', () => {
  let component: EnterpriseSliderComponent;
  let fixture: ComponentFixture<EnterpriseSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterpriseSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
