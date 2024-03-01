import { TestBed } from '@angular/core/testing';

import { StudentStatusService } from './student-status.service';

describe('StudentStatusService', () => {
  let service: StudentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
