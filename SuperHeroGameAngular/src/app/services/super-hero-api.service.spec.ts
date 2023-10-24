import { TestBed } from '@angular/core/testing';

import { SuperHeroApiService } from './super-hero-api.service';

describe('SuperHeroApiService', () => {
  let service: SuperHeroApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperHeroApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
