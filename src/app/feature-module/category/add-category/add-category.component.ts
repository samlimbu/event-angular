import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  subject$ = new Subject<void>();
  isUploadImgMsg = false;
  isButtonDisable: boolean = false;
  formId: any;
  user: string = '';
  title: string = '';
  image: any = null;
  imagefile: any;

  myForm: FormGroup = this._fb.group({
    _id: [''],
    name: ['', Validators.required],
    detail: [''],
    file: ['', Validators.required]
  });;
  @Output() someEvent = new EventEmitter<string>();

  constructor(private _fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.subject$)).subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.getFormData(params['id']);
      }
      else {
        this.title = 'Add New Category';
      }
    });
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  get f() {
    return this.myForm.controls;
  }

  getFormData(id: number) {
    this.categoryService.getDataById(id)
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => { console.log(data), this.setFormValues(data) },
        error: (error) => { },
        complete: () => { }
      })
  }
  setFormValues(list: any) {
    console.log(list);
    if (list.length == 0) {
      this.title = 'Add New Category';
    } else {
      this.title = 'Edit Category';
      const data = list[0];
      this.myForm.controls['_id'].setValue(data._id);
      this.myForm.controls['name'].setValue(data.name);
      this.myForm.controls['detail'].setValue(data.detail);
      this.f['file'].setErrors(null);
      this.image = {};
      this.image['imgbase64'] = this.imageService.sanitizeResource(`${data.file}`);
      console.log(this.image, this.isButtonDisable, this.myForm.valid);
    }


  }

  removeOption(i: number) {
    const control = <FormArray>this.myForm.controls['options'];
    control.removeAt(i);

  }
  get options() {
    return this.myForm.get('options') as FormArray;
  }
  save() {
    this.isButtonDisable = true;
    console.log('saving', this.myForm.value);
    let objForm = this.myForm.value;
    objForm.file = this.image.imgbase64.changingThisBreaksApplicationSecurity;

    if (this.title === 'Add New Category') {
      let addObj = {
        name: objForm.name,
        detail: objForm.detail,
        file: this.image.imgbase64.changingThisBreaksApplicationSecurity
      };
      this.categoryService.addData(addObj)
        .pipe(takeUntil(this.subject$)).subscribe({
          next: (data) => {
            
     
              this.isButtonDisable = false;
              this.router.navigate(['/category'])
         
          },
          error: (err) => { },    // errorHandler 
          complete: () => { }    // completeHandler this.router.navigate(['/dashboard']) {success: false, msg: 'Category already exists'}
        });
    }
    else if (this.title === 'Edit Category') {
      console.log('objForm', objForm);
      this.categoryService.update(objForm._id, objForm)
        .pipe(takeUntil(this.subject$)).subscribe({
          next: (data) => {
            this.isButtonDisable = false;
          
              this.router.navigate(['/category'])
         
          },
          error: () => { },    // errorHandler 
          complete: () => { }    // completeHandler this.router.navigate(['/dashboard'])
        });
    }

  }
  onFileClick() {
    if (!this.isUploadImgMsg && !this.image) {
      this.isUploadImgMsg = true;
    }

  }
  onFileSelected() {
    console.log(this.myForm.controls);
    if (!this.image) {
      this.isUploadImgMsg = false;
    }

    const inputNode: any = document.querySelector('#file');
    if (inputNode.files[0]) {
      this.image = {};
      this.image['filename'] = this.myForm.value.file.split('\\')[2];
      this.imagefile = '';
      this.imagefile = this.image['filename'];
    }
    console.log(this.myForm.value)

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let img64 = this.imageService.arrayBufferToBase64(e.target.result);
        this.image['imgbase64'] = this.imageService.sanitizeResource(`data:image;base64, ${img64}`);
        const reader = new FileReader();
        console.log(this.image);
      };
      if (inputNode.files[0]) {
        reader.readAsArrayBuffer(inputNode.files[0]);
      }
      else {

      }

    }
  }

}
