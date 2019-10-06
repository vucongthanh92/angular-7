import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-receipt-number',
  templateUrl: './receipt-number.component.html',
  styleUrls: ['./receipt-number.component.scss']
})
export class ReceiptNumberComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() sendReceiptNumber: EventEmitter<any> = new EventEmitter();

  public receiptNumber: string;

  constructor() { }

  ngOnInit() {
  }

  // ================== change value input ==================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.receiptNumber = '';
    }
  }

  // ================== send receipt number to search ==================
  onValueChanged() {
    this.sendReceiptNumber.emit(this.receiptNumber);
  }
}
