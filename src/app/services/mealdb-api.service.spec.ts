import { TestBed } from '@angular/core/testing';

import { MealdbApiService } from './mealdb-api.service';

describe('MealdbApiService', () => {
  let service: MealdbApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealdbApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
