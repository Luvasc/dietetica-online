import { TestBed } from '@angular/core/testing';

import { Cartc } from './cart';

describe('Cartc', () => {
  let service: Cartc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cartc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
