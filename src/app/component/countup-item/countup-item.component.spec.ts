import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountupItemComponent } from './countup-item.component';

describe('CountupItemComponent', () => {
  let component: CountupItemComponent;
  let fixture: ComponentFixture<CountupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountupItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
