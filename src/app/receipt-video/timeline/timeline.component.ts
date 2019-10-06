import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomService } from '../../services/custom.service';
import { isNumber } from 'util';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnChanges {

  @Input() totalTimeReceipt: string;
  @Input() unixRunTimeVideo: number;
  @Input() speedVideo: number;
  public runTime: string;
  public totalTime: string;

  constructor(
    private customService: CustomService
  ) { }

  ngOnInit() {
    this.runTime = '00:00';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.unixRunTimeVideo && isNumber(changes.unixRunTimeVideo.currentValue)) {
      this.runTime = this.customService.convertUnixTimeByPattern(changes.unixRunTimeVideo.currentValue, 'mm:ss');
    }
    if (changes.totalTimeReceipt && isNumber(changes.totalTimeReceipt.currentValue)) {
      this.totalTime = this.customService.convertUnixTimeByPattern(changes.totalTimeReceipt.currentValue, 'mm:ss');
    }
  }
}
