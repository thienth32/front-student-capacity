import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFaqComponent } from './detail-faq.component';

describe('DetailFaqComponent', () => {
  let component: DetailFaqComponent;
  let fixture: ComponentFixture<DetailFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
