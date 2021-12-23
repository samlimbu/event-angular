import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { SseService } from 'src/app/services/sse.service';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  subject$ = new Subject<void>();
  title: string = 'Notification Notice';
  isButtonDisable = false;
  ob1: any;
  myForm: FormGroup = this._fb.group({
    msg: ['', Validators.required],
    icon: [''],
  });;
  constructor(
    private _fb: FormBuilder,
    private sseService: SseService,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.ob1 = this.mapService.getMessage()
      .pipe(takeUntil(this.subject$))
      .subscribe(
        (data) => console.log(data)
      )
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();

  }
  save() {
    this.isButtonDisable = true;
    console.log('saving', this.myForm.value);
    this.myForm.controls['icon'].setValue('message');
    this.sseService.setSSEMessage(this.myForm.value)
      .subscribe({
        next: (data) => {
          this.isButtonDisable = false;
        },
        error: (err) => { },
        complete: () => {this.myForm.reset()}
      });
  }
}

