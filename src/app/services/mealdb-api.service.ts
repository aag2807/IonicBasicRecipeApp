import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";

export const MEALDB_API = {
  ROOT: "https://www.themealdb.com/api/json/v1/1/",
  get FILTER() {
    return this.ROOT + "filter.php";
  },
  get LOOKUP() {
    return this.ROOT + "lookup.php";
  },
};

export enum MEALDB_Category {
  "Beef" = "Beef",
  "Chicken" = "Chicken",
  "Lamb" = "Lamb",
  "Pasta" = "Pasta",
  "Pork" = "Pork",
  "Seafood" = "Seafood",
  "Starter" = "Starter",
  "Vegetarian" = "Vegetarian",
}

export interface MEALDB_ListItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

@Injectable({
  providedIn: "root",
})
export class MealdbApiService {
  meals$: BehaviorSubject<MEALDB_ListItem[]> = new BehaviorSubject([]);
  usedIds = new Set();

  constructor(private httpClient: HttpClient) {}

  getWhatToEat(): Observable<void> {
    const categoryAsArray = Object.keys(MEALDB_Category).map(
      (i) => MEALDB_Category[i]
    );

    const eightCategories = this._randomFromArray(categoryAsArray, 8);
    console.log("Eight", eightCategories);
    const arrayOfHttpCalls = eightCategories.map((cat) =>
      this.getMealByCategories(cat)
    );

    return forkJoin(arrayOfHttpCalls).pipe(
      map((res: Array<MEALDB_ListItem>) => {
        this.meals$.next(this.meals$.getValue().concat(res));
      })
    );
  }

  getMealByCategories(category: string): Observable<MEALDB_ListItem> {
    return this.httpClient.get(`${MEALDB_API.FILTER}?c=${category}`).pipe(
      map((res: any) => {
        if (res.meals) {
          let count = 0;
          let results;
          while (
            !results ||
            !results.strMealThumb ||
            (this.usedIds.has(results.idMeal) && count < 5)
          ) {
            results = this._randomFromArray(res.meals)[0];
            count++;
          }
          this.usedIds.add(results.idMeal);
          return results;
        }
      })
    );
  }

  getMealById(id: string): Observable<any> {
    return this.httpClient
      .get(`${MEALDB_API.LOOKUP}?i=${id}`)
      .pipe(map((res: any) => res.meals[0]));
  }

  private _randomFromArray(arr, times = 1) {
    const results = [];
    for (let i = 0; i < times; i++) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      results.push(arr[randomIndex]);
    }
    return results;
  }
}
