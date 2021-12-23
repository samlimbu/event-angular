import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject,takeUntil } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Output() textChange: any = new EventEmitter;
  subject$ = new Subject<void>();
  text!: string;
  modelChanged: Subject<string> = new Subject<string>();
  constructor() { }

  ngOnInit(): void {
    this.modelChanged
      .pipe(debounceTime(700), takeUntil(this.subject$),
        filter(res => res.length > -1),
        distinctUntilChanged())
      .subscribe(data => [
        this.textChange.emit(data),
        this.text = data
      ]);
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  changed(text: string) {
    this.modelChanged.next(text);
  }
}
