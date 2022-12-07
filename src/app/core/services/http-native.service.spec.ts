import { TestBed } from '@angular/core/testing';

import { HttpNativeService } from './http-native.service';

describe('HttpNativeService', () => {
  let service: HttpNativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpNativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
