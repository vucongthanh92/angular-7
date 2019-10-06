import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-livecam',
  templateUrl: './livecam.component.html',
  styleUrls: ['./livecam.component.css']
})
export class LivecamComponent implements OnInit {

  @Input() popupLiveCam: any;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onHiding() {
    this.close.emit(false);
  }
}
