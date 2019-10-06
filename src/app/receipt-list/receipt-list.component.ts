import { Component, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Receipt } from '../services/models/receipt';
import { CustomService } from '../services/custom.service';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit, OnChanges {

  @Input() listReceipt: Array<Receipt>;
  @Output() chooseReceipt = new EventEmitter();

  public displayReceipt: Array<Receipt>;
  public receiptNumber: string;
  public activeClicked: string;

  constructor(
    private customService: CustomService
  ) {
  }

  ngOnInit() {
    this.displayReceipt = [];
    this.activeClicked = '';
  }

  // ====================== change value input ======================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.listReceipt && changes.listReceipt.currentValue) {
      this.displayReceipt = changes.listReceipt.currentValue;
      this.activeClicked = '';
    }
  }

  // ================== event click choose receipt ==================
  clickReceipt(receipt: Receipt) {
    this.activeClicked = receipt.id;
    this.chooseReceipt.emit(receipt);
  }

  // ================== filter list receipt ==================
  filterReceipt(field: string) {
    this.displayReceipt = this.customService.filterReceipt(
      this.listReceipt,
      this.receiptNumber,
      field
    );
  }
}
