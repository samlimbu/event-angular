import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { formatDate } from '@angular/common';
import { ImageService } from 'src/app/services/image.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() item: any;
  @Input() LIST: any;
  @Output() buttonEvent: EventEmitter<any> = new EventEmitter();
  @Output() detailEvent: EventEmitter<any> = new EventEmitter();
  formattedDate: any;
  formattedTime: any;
  message: String = '';
  image: any;
  constructor(
    private imageService: ImageService,
    public dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes['LIST'].currentValue);
    if (changes['LIST'].currentValue) {
      this.check(changes['LIST'].currentValue);
    }
  }
 
  ngOnInit(): void {
    this.formattedDate = formatDate(this.item['date'], 'yyyy-MM-dd EE', 'en-US');
    this.formattedTime = formatDate(this.item['date'], 'h:mm:ss a', 'en-US');
    if (this.item['category_objid'][0]) {
      this.image = this.imageService.sanitizeResource(this.item['category_objid'][0]['file']);
    }

  }
  onAccept() {
    this.buttonEvent.emit({ data: this.item, action: 'accept' });
  }
  onDecline() {
    this.buttonEvent.emit({ data: this.item, action: 'decline' });
  }
  check(DATA: []) {
    DATA.forEach((element: any) => {
      if (element.event_id === this.item.id) {
        this.message = `You have ${element.response} this event.`
      }
    });
  }

  onDetail(e:any){
    this.detailEvent.emit(e);
  }

  onChange() {
    this.message = '';
  }
  
}
