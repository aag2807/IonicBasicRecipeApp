import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MealdbApiService } from "../services/mealdb-api.service";

@Component({
  selector: "app-meal",
  templateUrl: "./meal.page.html",
  styleUrls: ["./meal.page.scss"],
})
export class MealPage implements OnInit {
  id: string;
  meal$: Observable<any>;
  ingredients;
  instructions;

  constructor(
    private active: ActivatedRoute,
    private mealdb: MealdbApiService,
    private sanitizer: DomSanitizer
  ) {
    this.id = this.active.snapshot.paramMap.get("id");
    this.meal$ = this.mealdb.getMealById(this.id).pipe(
      tap((meal) => {
        console.log(meal);
        this.ingredients = this.getIngredientArray(meal);
        this.instructions = this.convertInstructionsToArray(meal)
      })
    );
  }

  ngOnInit() {}

  getYoutube(meal) {
    const id = meal.strYoutube.split("-")[1];
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://www.youtube.com/embed/${id}?enablejsapi=1&origin=http://example.com`
    );
  }

  getIngredientArray(meal: any) {
    const results = [];
    for (let i = 0; i <= 20; i++) {
      results.push([meal["strIngredient" + i], meal["strMeasure" + i]]);
    }
    return results.filter((i) => !!i[0]);
  }

  convertInstructionsToArray(meal: any) {
    return meal.strInstructions.split("\n")
      .filter((i) => i.trim());
  }
}
