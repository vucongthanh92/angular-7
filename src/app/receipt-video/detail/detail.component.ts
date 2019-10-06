import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() selectedReceipt: any;

  public popupLiveCam: boolean;

  constructor() {
  }

  ngOnInit() {
    this.popupLiveCam = false;
  }

  // ======================== show live camera ========================
  showLiveCamera() {
    this.popupLiveCam = true;
  }

  // ======================== hide live camera ========================
  hideLiveCamera(event: any) {
    this.popupLiveCam = event;
  }
}
