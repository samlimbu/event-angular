import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-choice',
  templateUrl: './category-choice.component.html',
  styleUrls: ['./category-choice.component.css']
})
export class CategoryChoiceComponent implements OnInit {
  subject$ = new Subject<void>();
  LIST: any;
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  getCategories() {
    this.categoryService.getAllDatawithFile()
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => [this.LIST = data, console.log(data)],
        error: (e) => console.error(e),
        complete: () => []
      })
  }
  onShowEvent(e:any){
    console.log(e);
    this.router.navigate(['/home/event'], { queryParams: { id: e._id } });
  }
}
