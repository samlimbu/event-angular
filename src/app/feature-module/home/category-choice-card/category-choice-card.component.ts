import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-category-choice-card',
  templateUrl: './category-choice-card.component.html',
  styleUrls: ['./category-choice-card.component.css']
})
export class CategoryChoiceCardComponent implements OnInit {
  @Input() item: any;
  @Output() buttonEvent: EventEmitter<any> = new EventEmitter();
  image: any;
  checkAgain = true;
  constructor(private imageService: ImageService) { }
  ngOnChanges(changes: SimpleChanges) {
   
    if(changes['item'].currentValue && this.checkAgain){
      this.checkAgain = false;
 
    //  this.image = this.imageService.sanitizeResource(item);
    }
  }
  ngOnInit(): void {
    this.image = this.imageService.sanitizeResource(this.item.file);
  }
  onShowEvent(e: any){
    this.buttonEvent.emit(e);
  }
}
