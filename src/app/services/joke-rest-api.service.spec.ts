import { TestBed } from '@angular/core/testing';

import { JokeRestApiService } from './joke-rest-api.service';

describe('JokeRestApiService', () => {
  let service: JokeRestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JokeRestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
