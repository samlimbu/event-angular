import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {
  @Input() emails: any[];
  public colors: string[] = [
    'yellow',
    'green',
    'blue',
    'ping'
  ];
  constructor(){
    this.emails = [];
  }
}
