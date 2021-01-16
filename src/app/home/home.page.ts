import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { MealdbApiService } from '../services/mealdb-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  meals$ = this.mealdb.meals$;

  constructor(private mealdb: MealdbApiService) {
    this.loadData()
  }

  loadData($e?){
    this.mealdb.getWhatToEat().pipe(take(1)).subscribe(
      done => {
        if($e) {
          $e.target.complete();
        }
      }
    )
  }
}
