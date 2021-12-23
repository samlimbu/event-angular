import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { ThemePalette } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MapService } from 'src/app/services/map.service';
import { debounceTime, filter, from, map, merge, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  subject$= new Subject <void>();
  isShowSaving: boolean = false;
  lonLat?:any ;
  CATEGORYLIST: any;
  formId: any;
  user: string = '';
  title: string = '';
  defaultTime: any;
  @Output() someEvent = new EventEmitter<string>();
  @ViewChild('picker') picker: any;
  public date: any;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: any;
  public maxDate: any;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  selectedCategory = '61b77945cb971b62ccdd59fd';
  public dateControl = new FormControl('', Validators.required);
  myForm: FormGroup = this._fb.group({
    id: [''],
    title: ['', Validators.required],
    subtitle: ['', Validators.required],
    date: this.dateControl,
    category_objid: ['', Validators.required],
    detail: [''],
    lat: [''],
    lon: [''],
    options: this._fb.array([])
  });;
  constructor(private _fb: FormBuilder,
    private router: Router,
    private eventService: EventService,
    private route: ActivatedRoute,
    private category: CategoryService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.getCategories();
   
    this.test();
  }
  test(){
    const nums = of(1, 2, 3, 4, 5);
    let stream = from([1,2,3,4]);
    const source = from([
      { name: 'John', age: 20 },
      { name: 'Alek', age: 25 },
      { name: 'Rosy', age: 18 }
  ]);

  source
    .pipe(
      (map((data) => data.name))
    )
    // this.category.getAllData()
    // .pipe(
    //   switchMap((val)=>{
    //     console.log('source val', val);
    //     console.log('new observable')
    //     return this.mapService.getCoordinateLIST()
    //   })
    // )
    .subscribe(
      (data)=>console.log(data)
    )
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  getCategories() {
    this.category.getAllData()
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => { this.CATEGORYLIST = data },
        error: (err) => { },
        complete: () => {
          this.route.queryParams.pipe(takeUntil(this.subject$)).subscribe(params => {
            if (params['id']) {

              this.getFormData(params['id']);
            }
            else {
              this.title = 'Add New Event';
              this.mapService.getPosition((e:any)=>{
                console.log(e);
                this.mapService.setMapCoordinateLIST([e.coords.longitude, e.coords.latitude]);
              });
              
            }
          });

          this.mapService.getCoordinateLIST()
            .pipe(takeUntil(this.subject$)).subscribe(
              data => {
                this.myForm.controls['lat'].setValue(data.lonLat[1]);
                this.myForm.controls['lon'].setValue(data.lonLat[0]);
               
              }
            )
          this.myForm.value;

        }

      })
  }


  get f() {
    return this.myForm.controls;
  }
  onSelectionChange(e: any) {
    console.log(this.myForm.value);
    console.log(e.value, this.CATEGORYLIST.find((x: { _id: any; }) => x._id == e.value));

  }
  getFormData(id: number) {
    this.eventService.getDataById(id)
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => { console.log(data), this.setFormValues(data) },
        error: (error) => { },
        complete: () => { }
      })
  }
  setFormValues(list: any) {
    console.log(list);
    if (list.length == 0) {
      this.title = 'Add New Event';
    } else {
      this.title = 'Edit Event';
      const data = list[0];
      this.lonLat = [data.lon,data.lat];
      this.mapService.setMapCoordinateLIST([data.lon,data.lat]);
      console.log(data);
      this.myForm.controls['id'].setValue(data.id);
      this.myForm.controls['title'].setValue(data.title);
      this.myForm.controls['subtitle'].setValue(data.subtitle);
      this.dateControl.setValue(new Date(data.date));
      this.myForm.controls['category_objid'].setValue(data.category_objid);
      this.selectedCategory = data.category_objid[0];
      //this.myForm.controls['category'].setValue(data.category);
      this.myForm.controls['detail'].setValue(data.detail);
      for (let i = 0; i < data.options.length; i++) {
        this.addOption();
      }
      setTimeout(() => {
        this.options.setValue(data.options);
      }, 0);

    }

  }

  addOption() {
    console.log(Date.now());
    let products = this.myForm.get('options') as FormArray;
    products.push(this._fb.group({
      detail: [''],
      count: ['']
    }));
  }

  removeOption(i: number) {
    const control = <FormArray>this.myForm.controls['options'];
    control.removeAt(i);

  }
  get options() {
    return this.myForm.get('options') as FormArray;
  }
  save() {
    this.isShowSaving = true;
    console.log('saving.............', this.myForm.value);
    let category_name = this.CATEGORYLIST.find((x: { _id: any; }) => x._id == this.f['category_objid'].value).name;
    console.log(category_name);

    let objForm = this.myForm.value;
    let dateTimeStr = formatDate(`${this.myForm.value['date']}`, 'yyyy-MM-dd hh:mm:ss a zzzz', 'en-US');
    objForm.date = dateTimeStr;
    objForm.category_objid = this.myForm.value.category_objid;
    objForm.category = category_name;
    console.log('saving', this.myForm.value, objForm);

    if (this.title === 'Add New Event') {
      objForm.createdOn = Date.now();
      this.eventService.addData(objForm, null)
        .pipe(takeUntil(this.subject$)).subscribe({
          next: () => { },
          error: () => { },
          complete: () => { this.isShowSaving = false, this.router.navigate(['/event']) }
        });
    }
    else if (this.title === 'Edit Event') {
      console.log('objForm', objForm);
      this.eventService.update(objForm.id, objForm)
        .pipe(takeUntil(this.subject$)).subscribe({
          next: () => { },
          error: () => { },
          complete: () => { this.isShowSaving = false, this.router.navigate(['/event']) }
        });
    }

  }
}

