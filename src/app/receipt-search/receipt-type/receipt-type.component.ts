import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CustomService } from '../../services/custom.service';

@Component({
  selector: 'app-receipt-type',
  templateUrl: './receipt-type.component.html',
  styleUrls: ['./receipt-type.component.scss']
})
export class ReceiptTypeComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() sendReceiptType: EventEmitter<any> = new EventEmitter();

  public receiptTypeList: Array<any>;
  public receiptType: string;

  constructor(
    private customService: CustomService
  ) {
  }

  ngOnInit() {
    this.receiptType = '0';
    this.receiptTypeList = this.customService.receiptTypeList;
  }

  // ================== change value input ==================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.receiptType = '0';
    }
  }

  // ================== send receipt type ==================
  onSelectionChanged() {
    this.sendReceiptType.emit(this.receiptType);
  }
}
