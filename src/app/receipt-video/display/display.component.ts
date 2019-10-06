import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Options } from 'ng5-slider';
import { ApiService } from '../../services/api.service';
import { CustomService } from '../../services/custom.service';
import { DisplayService } from './display.service';

import { Receipt } from '../../services/models/receipt';
import { ReceiptItem } from '../../services/models/receipt-item';
import { ReceiptImage } from '../../services/models/receipt-image';
import { Video } from '../../services/models/video';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnChanges {

  // ====================== input, output component display ======================
  @Input() itemPanel: string;
  @Input() receiptPanel: string;
  @Input() selectedReceipt: Receipt;
  @Input() selectedItem: ReceiptItem;
  @Output() objCurrentVideo: EventEmitter<Video> = new EventEmitter();

  private frameVideo: number;
  public speedVideo: number;
  public currentImage = new ReceiptImage();
  public listImages: Array<ReceiptImage>;

  public valueSlider: number;
  public statusSlider: number;
  public optionSlider: Options;
  public refreshSlider: EventEmitter<void> = new EventEmitter<void>();

  public currentTime = '';
  private countTime: Subscription;
  public totalTimeReceipt: number;
  public unixRunTimeVideo: number;
  private startTime: string;

  public activeButton: string;
  public showNavigator = false;

  constructor(
    private apiService: ApiService,
    private customService: CustomService,
    private displayService: DisplayService
  ) {
  }

  ngOnInit() {
    this.frameVideo = 20;
    this.speedVideo = 1;
    this.unixRunTimeVideo = 0;
    this.currentImage.path = this.displayService.defaultImage;
    this.listImages = [];
    this.setValueVideo(0, 0);
  }

  // ====================== function get change value input from other component ======================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receiptPanel && changes.receiptPanel.currentValue) {
      this.refreshSlider.emit();
    }
    if (changes.itemPanel && changes.itemPanel.currentValue) {
      this.refreshSlider.emit();
    }

    this.onPause();
    if (changes.selectedItem && changes.selectedItem.currentValue) {
      this.valueSlider = this.displayService.changeValueVideoByItem(changes.selectedItem.currentValue);
      this.currentImage = this.displayService.setValueCurrentImage(
        this.valueSlider,
        this.listImages
      );
      this.getUnixRunTimeReceipt();
      changes.selectedItem = null;
    }

    if (changes.selectedReceipt && changes.selectedReceipt.currentValue === 0) {
      this.showNavigator = false;
      this.currentImage.path = this.displayService.defaultImage;
      this.valueSlider = 0;
      this.listImages = [];
      this.speedVideo = 1;
    }

    if (changes.selectedReceipt && changes.selectedReceipt.currentValue) {
      this.speedVideo = 1;
      this.startTime = changes.selectedReceipt.currentValue.start;
      this.totalTimeReceipt = this.displayService.calcTotalTimeReceipt(
        changes.selectedReceipt.currentValue.start,
        changes.selectedReceipt.currentValue.end
      );
      this.getTimeZone().then(
        (timezone: number) => {
          this.getListImages(timezone);
        }
      );
    }
  }

  // ====================== function get camera timezone and browser timezone ======================
  getTimeZone() {
    let timezoneCamera = 0;
    const timezoneBrowser = sessionStorage.getItem('timezone-browser');
    return new Promise(timezoneRange => {
      this.apiService.getTimeZone({
        storecode: this.selectedReceipt.storeCode,
        pos: this.selectedReceipt.posNumber
      }).subscribe(
        (response) => {
          if (response && response.data.length > 0) {
            timezoneCamera = Number(response.data[0].TimeZoneOffset);
            timezoneRange(Number(timezoneCamera) + Number(timezoneBrowser));
          }
        },
        error => {
          timezoneRange(0);
        }
      );
    });
  }

  // ====================== function get list images by begin time and end time ======================
  getListImages(timezone: number = 0) {
    const beginTime = this.customService.addTimeZoneBrowser(
      this.selectedReceipt.start,
      timezone,
      'YYYY-MM-DD HH:mm:ss'
    );
    const endTime = this.customService.addTimeZoneBrowser(
      this.selectedReceipt.end,
      timezone,
      'YYYY-MM-DD HH:mm:ss'
    );

    this.listImages = [];
    this.objCurrentVideo.emit(this.displayService.setCurrentTimeVideo());
    this.currentImage.path = this.displayService.loadingImage;
    this.apiService.getImagesByReceipt({
      start: beginTime,
      end: endTime
    }).subscribe(
      images => {
        if (images && (images.data.length > 0)) {
          this.valueSlider = 0;
          this.listImages = images.data;
          this.currentImage = this.displayService.setValueCurrentImage(
            this.valueSlider,
            this.listImages
          );
          this.optionSlider = this.displayService.setValueSlider(0, this.listImages.length - 1);
          this.timeChange();
          this.displayService.calcTotalSizeImagesLoading(this.listImages.length);
        }
        if (images && images.data.length === 0) {
          this.showNavigator = false;
          this.currentImage.path = this.displayService.errorImage;
        }
      },
      error => {
        this.showNavigator = false;
        this.currentImage.path = this.displayService.errorImage;
      }
    );
  }

  // =============== function change image when change time and send to component item ===============
  timeChange() {
    let objVideo: Video;
    if ((this.currentImage) && (this.currentImage.name !== '')) {
      this.currentTime = this.displayService.convertImageName(this.currentImage.name);
      objVideo = {
        frame: this.valueSlider,
        time: this.customService.convertTimeToNumber(this.currentTime),
        checkEndVideo: false
      };
      if (this.valueSlider >= this.listImages.length - 2) {
        objVideo.checkEndVideo = true;
      }
      this.objCurrentVideo.emit(objVideo);
    }
  }

  // ====================== function set value video ======================
  setValueVideo(value: number, status: number) {
    this.valueSlider = value;
    this.statusSlider = status;
  }

  // ================== function change value when drap navigator video ==================
  changeValueSlider(value: number) {
    this.valueSlider = value;
    this.getUnixRunTimeReceipt();
    this.onPause();
    this.currentImage = this.displayService.setValueCurrentImage(
      this.valueSlider,
      this.listImages
    );
    this.timeChange();
  }

  // ====================== function get unix runtime video ======================
  getUnixRunTimeReceipt() {
    this.unixRunTimeVideo = this.displayService.calcTimeRunVideo(
      this.startTime,
      this.listImages[this.valueSlider].name
    );
  }

  // ===================== function progress run video, calculator frame on millisecond =====================
  runVideoReceipt(frame: number) {
    if (this.countTime) {
      this.countTime.unsubscribe();
    }
    const intervalInMilliseconds = 1000 / frame;
    this.countTime = interval(intervalInMilliseconds)
      .subscribe(() => {
        if (this.valueSlider < this.listImages.length) {
          this.currentImage = this.displayService.setValueCurrentImage(
            this.valueSlider,
            this.listImages
          );
          this.getUnixRunTimeReceipt();
          this.timeChange();
          this.valueSlider++;
          if (this.valueSlider >= this.listImages.length - 1) {
            this.setDefaultValueSpeedVideo();
            this.statusSlider = 0;
            this.activeButton = 'onPause';
            this.countTime.unsubscribe();
          }
        }
      });
  }

  // ====================== function set default value speed video ======================
  setDefaultValueSpeedVideo() {
    this.frameVideo = 20;
    this.speedVideo = 1;
  }

  // ====================== function buttons navigation on video =========================

  // ====================== function play video =========================
  onPlay() {
    this.activeButton = 'onPlay';
    if (this.statusSlider === 1) {
      return;
    }
    if (!this.selectedReceipt) {
      return;
    }
    if ((this.statusSlider === 1) && (this.valueSlider >= this.listImages.length - 1) && (this.countTime)) {
      this.countTime.unsubscribe();
      return;
    }
    if ((this.statusSlider === 0) && (this.valueSlider >= this.listImages.length - 1)) {
      this.valueSlider = 0;
    }
    this.statusSlider = 1;
    this.runVideoReceipt(this.frameVideo);
  }

  // ====================== function pause video =========================
  onPause() {
    this.activeButton = 'onPause';
    if (this.countTime) {
      this.activeButton = 'onPause';
      this.statusSlider = 0;
      this.countTime.unsubscribe();
    }
  }

  // ====================== function speed up video =========================
  onSpeedUp() {
    if (this.speedVideo === 16) {
      this.speedVideo = 1;
    } else {
      this.speedVideo = this.speedVideo * 2;
    }
    this.frameVideo = this.speedVideo * 20;
    if (this.statusSlider === 1) {
      this.runVideoReceipt(this.frameVideo);
    }
  }

  // ====================== function speed down video =========================
  onSpeedDown() {
    if (this.speedVideo === 0.5) {
      this.speedVideo = 1;
    } else {
      this.speedVideo = this.speedVideo / 2;
    }
    this.frameVideo = this.speedVideo * 20;
    if (this.statusSlider === 1) {
      this.runVideoReceipt(this.frameVideo);
    }
  }

  // ====================== function stop video =========================
  onStop() {
    this.speedVideo = 1;
    this.frameVideo = 20;
    this.activeButton = 'onStop';
    this.countTime.unsubscribe();
    this.setValueVideo(0, 0);
    this.currentImage = this.displayService.setValueCurrentImage(
      this.valueSlider,
      this.listImages
    );
    this.timeChange();
    this.getUnixRunTimeReceipt();
  }

  // ====================== function backward video =========================
  onBackward() {
    this.activeButton = 'onPause';
    let timeTemp = this.customService.convertTimeToNumber(this.currentTime);
    let statusChecked = 0;
    timeTemp -= 5;
    for (let index = this.valueSlider; index >= 0; index--) {
      const imageName = this.displayService.convertImageName(this.listImages[index].name);
      const imageTime = this.customService.convertTimeToNumber(imageName);
      if (timeTemp === imageTime) {
        this.valueSlider = index;
        this.countTime.unsubscribe();
        statusChecked = 1;
        break;
      }
    }
    if (statusChecked === 0) {
      this.valueSlider = 0;
    }
    this.statusSlider = 0;
    this.countTime.unsubscribe();
    if (this.valueSlider <= 0) {
      this.valueSlider = 0;
    }
    this.currentImage = this.displayService.setValueCurrentImage(
      this.valueSlider,
      this.listImages
    );
    this.getUnixRunTimeReceipt();
    this.timeChange();
  }

  // ====================== function forward video =========================
  onForward() {
    this.activeButton = 'onPause';
    let timeTemp = this.customService.convertTimeToNumber(this.currentTime);
    let statusChecked = 0;
    timeTemp += 5;
    for (let index = this.valueSlider; index < this.listImages.length; index++) {
      const imageName = this.displayService.convertImageName(this.listImages[index].name);
      const imageTime = this.customService.convertTimeToNumber(imageName);
      if (timeTemp === imageTime) {
        this.valueSlider = index;
        this.countTime.unsubscribe();
        statusChecked = 1;
        break;
      }
    }
    if (statusChecked === 0) {
      this.valueSlider = this.listImages.length - 1;
    }
    this.statusSlider = 0;
    this.countTime.unsubscribe();
    if (this.valueSlider >= this.listImages.length - 1) {
      this.valueSlider = this.listImages.length - 1;
    }
    this.currentImage = this.displayService.setValueCurrentImage(
      this.valueSlider,
      this.listImages
    );
    this.getUnixRunTimeReceipt();
    this.timeChange();
  }
}
