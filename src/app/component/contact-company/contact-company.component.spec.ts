import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCompanyComponent } from './contact-company.component';

describe('ContactCompanyComponent', () => {
  let component: ContactCompanyComponent;
  let fixture: ComponentFixture<ContactCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
