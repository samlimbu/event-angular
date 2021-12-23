import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import Map from 'ol/Map';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {
  @Input() map?: any;
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.map.setTarget(this.elementRef.nativeElement);
  }

}
