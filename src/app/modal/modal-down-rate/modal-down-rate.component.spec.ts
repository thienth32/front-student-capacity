import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDownRateComponent } from './modal-down-rate.component';

describe('ModalDownRateComponent', () => {
  let component: ModalDownRateComponent;
  let fixture: ComponentFixture<ModalDownRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDownRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDownRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
