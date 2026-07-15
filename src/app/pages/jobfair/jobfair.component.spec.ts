import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobfairComponent } from './jobfair.component';

describe('JobfairComponent', () => {
  let component: JobfairComponent;
  let fixture: ComponentFixture<JobfairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobfairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobfairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
