import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CustomService } from '../services/custom.service';
import { Setting } from '../services/models/setting';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, OnChanges {

  @Input() popupSetting: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  public statusPopup: boolean;
  public setting = new Setting();
  public settingID: string;
  public notify: boolean;
  public error: string;

  constructor(
    private apiService: ApiService,
    private customService: CustomService
  ) {
    this.settingID = this.customService.settingID;
  }

  ngOnInit() {
    this.statusPopup = false;
    this.notify = false;
    this.error = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.popupSetting && changes.popupSetting.currentValue === true) {
      this.statusPopup = changes.popupSetting.currentValue;
      this.getSettingByID(this.settingID);
    }
  }

  // =========================== get setting by ID ===========================
  getSettingByID(id: string) {
    this.apiService.getSettingByID(id).subscribe(
      response => {
        if (response) {
          this.setting.SettingId = response.data.SettingId;
          this.setting.StoreCode = response.data.StoreCode;
          this.setting.Pos = response.data.Pos;
          this.setting.CameraName = response.data.CameraName;
          this.setting.CameraIp = response.data.CameraIp;
          this.setting.CameraFtpFolder = response.data.CameraFtpFolder;
          this.setting.TimeZoneOffset = response.data.TimeZoneOffset;
          this.setting.TimeZone = response.data.TimeZone;
          this.setting.Position = response.data.Position;
        }
      }
    );
  }

  // =========================== event click update button ===========================
  clickUpdateBtn() {
    this.onHiding();
    this.notify = true;
    this.apiService.updateSettingByID(this.setting).subscribe(
      response => {
        this.error = 'Update success';
      },
      err => {
        this.error = 'Update failed';
      }
    );
  }

  // ======================== send status popup to component view ========================
  onHiding() {
    this.statusPopup = false;
    this.close.emit(false);
  }
}
