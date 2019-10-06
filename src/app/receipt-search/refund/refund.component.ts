import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() sendRefund: EventEmitter<any> = new EventEmitter();

  public refund: boolean;

  constructor() {
    this.refund = false;
  }

  ngOnInit() {
  }

  // ================== change value input ==================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.refund = false;
    }
  }

  // ================== send value refund to search ==================
  onValueChanged(event: any) {
    this.sendRefund.emit(event.value);
  }
}
