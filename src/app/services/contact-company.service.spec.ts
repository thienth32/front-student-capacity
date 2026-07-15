import { TestBed } from '@angular/core/testing';

import { ContactCompanyService } from './contact-company.service';

describe('ContactCompanyService', () => {
  let service: ContactCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
