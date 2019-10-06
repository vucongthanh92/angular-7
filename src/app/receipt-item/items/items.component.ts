import {
  Component,
  OnInit,
  OnChanges,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  AfterViewChecked,
  ElementRef,
  ViewChild
} from '@angular/core';

import { ReceiptItem } from '../../services/models/receipt-item';
import { CustomService } from '../../services/custom.service';
import { Video } from '../../services/models/video';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnChanges, AfterViewChecked {

  @ViewChild('scrollReceiptItem') public scrollReceiptItem: ElementRef;
  @Input() objCurrentVideo: Video;
  @Input() selectedReceipt: any;
  @Output() selectedItem = new EventEmitter();

  public versionItem: number;
  public receiptItem: Array<ReceiptItem> = [];
  public totalItem: number;
  public totalQuantity: number;
  public totalAmount: number;
  public checkedItem: string;
  public disableScrollDown = false;

  constructor(
    private customService: CustomService,
  ) {
  }

  ngOnInit() {
    this.checkedItem = '';
    this.versionItem = 0;
    this.setDefaultTotalItem();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // ====================== scroll list item receipt to bottom ======================
  scrollToBottom(status: number = 0) {
    if (this.disableScrollDown) {
      return;
    }
    try {
      this.scrollReceiptItem.nativeElement.scrollTop = this.scrollReceiptItem.nativeElement.scrollHeight;
    } catch (err) { }
  }

  // =================== event scroll of div and status disable scroll ===================
  onScroll() {
    this.disableScrollDown = true;
  }

  // ====================== change value input ======================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedReceipt && changes.selectedReceipt.currentValue === 0) {
      this.receiptItem = [];
    }
    if (changes.selectedReceipt && changes.selectedReceipt.currentValue) {
      this.getReceiptItem(changes.selectedReceipt.currentValue);
    }
    if (changes.objCurrentVideo && this.receiptItem.length > 0) {
      this.disableScrollDown = false;
      this.changeReceiptItem(
        this.objCurrentVideo.time,
        this.objCurrentVideo.frame
      );
    }
  }

  // ====================== get list item by receipt ======================
  getReceiptItem(receipt: any) {
    this.receiptItem = [];
    receipt.postdate = this.customService.convertTimeReceipt(receipt.postdate);
    receipt.invcpostdate = this.customService.convertTimeReceipt(receipt.invcpostdate);
    this.receiptItem = receipt.item.map(
      (item: any) => {
        return {
          id: item.alu,
          quantity: item.qty,
          startTime: item.postdate,
          price: item.price,
          description: item.description1,
          unixTime: this.customService.convertTimeToNumber(item.postdate),
          frame: '',
          status: 0,
          itemtype: item.itemtype
        };
      }
    );
  }

  // ================ change status item hide/show and add frame into item ================
  changeReceiptItem(time: number = 0, frame: number = 0) {
    if (time < this.objCurrentVideo.time) {
      this.objCurrentVideo.checkEndVideo = false;
    }
    if (this.objCurrentVideo.checkEndVideo) {
      this.receiptItem.map(
        (item: any) => {
          this.checkedItem = item.unixTime;
          if (item.status === 0) {
            item.status = 1;
            item.frame = frame;
          }
        }
      );
    } else {
      this.receiptItem.map(
        (item: any) => {
          if ((item.status === 0) && (time > item.unixTime)) {
            this.checkedItem = item.unixTime;
            item.status = 1;
            item.frame = frame;
          }
          if (time < item.unixTime) {
            item.status = 0;
          }
        }
      );
    }
    this.getTotalItem();
  }

  // ====================== get total item - quantity - amount ======================
  getTotalItem() {
    this.setDefaultTotalItem();
    this.receiptItem.filter(
      item => {
        if (item.status === 1) {
          this.totalItem++;
          this.totalQuantity += Number(item.quantity);
          this.totalAmount += (Number(item.price) * Number(item.quantity));
        }
      }
    );
  }

  // ====================== event click item receipt ======================
  clickReceiptItem(timeItem: string, frameItem: string) {
    this.checkedItem = timeItem;
    this.selectedItem.emit({
      frame: frameItem,
      version: this.versionItem
    });
    this.changeReceiptItem(Number(timeItem), Number(frameItem));
    this.versionItem++;
  }

  // ==================== set default value total item ====================
  setDefaultTotalItem() {
    this.totalItem = 0;
    this.totalQuantity = 0;
    this.totalAmount = 0;
  }
}
