import { TestBed } from '@angular/core/testing';

import { HttpIntereceptorService } from './http-intereceptor.service';

describe('HttpIntereceptorService', () => {
  let service: HttpIntereceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpIntereceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
