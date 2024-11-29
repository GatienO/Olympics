import { TestBed } from '@angular/core/testing';

import { OlympicDataService } from './olympic-data.service';

describe('OlympicDataService', () => {
  let service: OlympicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlympicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
