import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoCapacityComponent } from './modal-info-capacity.component';

describe('ModalInfoCapacityComponent', () => {
  let component: ModalInfoCapacityComponent;
  let fixture: ComponentFixture<ModalInfoCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInfoCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
