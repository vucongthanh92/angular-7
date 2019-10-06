import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomService } from './services/custom.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private customService: CustomService
  ) {
  }

  ngOnInit() {
    this.customService.setFormatDateTime();
    sessionStorage.setItem('timezone-browser', this.customService.getTimeZoneBrowser());
  }

  // ================== destroy session storage ==================
  ngOnDestroy() {
    sessionStorage.clear();
  }
}
