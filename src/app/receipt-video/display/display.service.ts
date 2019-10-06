import { Injectable } from '@angular/core';
import { CustomService } from '../../services/custom.service';
import { ReceiptImage } from '../../services/models/receipt-image';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  public defaultImage = 'assets/img/video-default.png';
  public loadingImage = 'assets/img/ajax-loader.gif';
  public errorImage = 'assets/img/video-error.jpg';

  constructor(
    private customService: CustomService
  ) {
  }

  // ============================== convert images name ==============================
  convertImageName(value: string) {
    const strName = value.replace('.jpg', '').replace('_', 'T');
    const arrName = strName.split('');
    arrName[11] = ':';
    arrName[14] = ':';
    arrName[17] = '.';
    arrName.unshift('20');
    const result = arrName.join('');
    return result;
  }

  // ============================= set default time video =============================
  setCurrentTimeVideo() {
    return {
      frame: 0,
      time: 0,
      checkEndVideo: false
    };
  }

  // ============================= set value current image =============================
  setValueCurrentImage(index: number, listImages: any) {
    const imageObj = new ReceiptImage();
    imageObj.path = listImages[index].path;
    imageObj.name = listImages[index].name;
    return imageObj;
  }

  // =========================== change value video by item ===========================
  changeValueVideoByItem(item: any) {
    return Number(item.frame);
  }

  // =========================== set value slider ===========================
  setValueSlider(start: number = 0, end: number = 0) {
    return {
      floor: start,
      ceil: end
    };
  }

  // ======================== calculator total size images loading ========================
  calcTotalSizeImagesLoading(length: number = 0) {
    let totalSize = 0;
    const step = 90;
    const multiplier = Math.pow(10, 3 || 0);
    for (let index = 0; index < length; index++) {
      totalSize = totalSize + step;
    }
    totalSize = Math.round((totalSize / 1024) * multiplier) / multiplier;
    console.log('Total size loading:', totalSize + ' MB');
  }

  // =========================== calculator total time receipt ===========================
  calcTotalTimeReceipt(start: string, end: string) {
    const startTime = this.customService.convertTimeToNumber(start);
    const endTime = this.customService.convertTimeToNumber(end);
    const totalTime = endTime - startTime;
    return totalTime;
  }

  // =========================== calculator time run video ===========================
  calcTimeRunVideo(start: string, end: string) {
    let runTime = 0;
    const startTime = this.customService.convertTimeToNumber(start);
    const endTime = this.customService.convertTimeToNumber(this.convertImageName(end));
    if (startTime < endTime) {
      runTime = (endTime - startTime);
    }
    return runTime;
  }
}
