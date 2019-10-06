import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CustomService } from '../../services/custom.service';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() chooseDateTime: EventEmitter<{ fromDate: string, toDate: string }> = new EventEmitter();

  public fromDate: string;
  public toDate: string;

  constructor(
    private customService: CustomService
  ) { }

  ngOnInit() {
  }

  // ================== change value date ==================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.fromDate = null;
      this.toDate = null;
      changes.clearAllSearch = null;
    }
  }

  // ==================== send value from date and to date ====================
  onValueChanged() {
    const chooseDatetime: any = {
      fromDate: null,
      toDate: null
    };
    if (this.fromDate) {
      chooseDatetime.fromDate = this.customService.removeTimeZone(this.fromDate);
    }
    if (this.toDate) {
      chooseDatetime.toDate = this.customService.removeTimeZone(this.toDate);
    }
    this.chooseDateTime.emit(chooseDatetime);
  }
}
