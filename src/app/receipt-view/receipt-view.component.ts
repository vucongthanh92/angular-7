import { Component, OnInit } from '@angular/core';
import { Search } from '../services/models/search';
import { Receipt } from '../services/models/receipt';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { CustomService } from '../services/custom.service';
import { Video } from '../services/models/video';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {
  public itemPanel: string;
  public receiptPanel: string;
  public isSearch = true;
  public loadding: boolean;
  public isRefund: boolean;
  public listReceipt: Array<Receipt> = [];
  public selectedReceipt: any;
  public selectedItem: any;
  public searchParams = new Search();
  public objCurrentVideo: Video;
  public clearAllSearch: number;
  public popupSetting: boolean;

  constructor(
    private apiService: ApiService,
    private customService: CustomService,
    private router: Router
  ) {
    this.clearAllSearch = 0;
    this.popupSetting = false;
    this.objCurrentVideo = {
      frame: 0,
      time: 0,
      checkEndVideo: false
    };
  }

  ngOnInit() {
    this.loadding = false;
    this.itemPanel = '1';
    this.receiptPanel = '1';
  }

  // ================== event click search button ==================
  clickSearchButton() {
    this.clearAllSearch = 0;
    this.resetValueReceipt();

    this.loadding = true;
    const cols = this.customService.getColsApiSearchReceipt();
    const sort = 'postdate,desc';
    this.apiService.getReceipts(this.searchParams, cols, sort)
      .subscribe(
        response => {
          if (response) {
            this.listReceipt = response.data.map(
              (receipt: any, index: number) => {
                const receiptTemp = new Receipt();
                receiptTemp.id = (index + 1).toString();
                if (!receipt.docno) {
                  receiptTemp.no = receipt.btid;
                } else {
                  receiptTemp.no = receipt.docno;
                }
                receiptTemp.start = receipt.postdate;
                receiptTemp.end = receipt.invcpostdate;
                receiptTemp.item = receipt.docitem;
                receiptTemp.posID = receipt.workstationuid;
                receiptTemp.posName = receipt.workstationname;
                receiptTemp.posNumber = receipt.workstationno;
                receiptTemp.storeID = receipt.storesid;
                receiptTemp.storeName = receipt.storename;
                receiptTemp.storeCode = receipt.storecode;
                receiptTemp.receiptType = receipt.receipttype;
                receiptTemp.fullname = '';
                if (receipt.btfirstname && receipt.btfirstname !== '') {
                  receiptTemp.fullname += receipt.btfirstname;
                }
                if (receipt.btlastname && receipt.btlastname !== '') {
                  receiptTemp.fullname += ' ' + receipt.btlastname;
                }
                if (receipt.hasreturn === 1) {
                  receiptTemp.type = 'Return';
                  receiptTemp.total = receipt.givenamt;
                } else {
                  if (!receipt.docno) {
                    receiptTemp.type = 'Order';
                  } else {
                    receiptTemp.type = 'Receipt';
                  }
                  if (receipt.takenamt === 0) {
                    receiptTemp.total = receipt.ordersubtotal;
                  } else {
                    receiptTemp.total = receipt.takenamt;
                  }
                }
                return receiptTemp;
              }
            );
            this.loadding = false;
          }
        }, err => {
          console.log(err);
          this.loadding = false;
        }
      );
  }

  // ================== get selected receipt from list to view ==================
  getSelectedReceipt(receipt: any) {
    this.selectedReceipt = receipt;
  }

  // ================== get selected item from item to view ==================
  getSelectedItem(item: string) {
    this.selectedItem = item;
  }

  // ================== log out ==================
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // ================== event click clear button ==================
  clickClearButton() {
    this.resetValueReceipt();
    this.resetValueSearch(1);
  }

  // ================== function reset value list receipt ==================
  resetValueReceipt() {
    this.listReceipt = [];
    this.selectedReceipt = 0;
  }

  // ================== function reset value search ==================
  resetValueSearch(value: number = 0) {
    this.clearAllSearch += value;
  }

  // ================== function change receipt Panel status ==================
  changeReceiptPanel() {
    if (this.receiptPanel === '0') {
      this.receiptPanel = '1';
    } else {
      this.receiptPanel = '0';
    }
  }

  // ================== function change item Panel status ==================
  changeItemPanel() {
    if (this.itemPanel === '0') {
      this.itemPanel = '1';
    } else {
      this.itemPanel = '0';
    }
  }

  // ================== function show setting ==================
  showSetting() {
    this.popupSetting = true;
  }

  // ================== function hide setting ==================
  hideSetting(event: any) {
    this.popupSetting = event;
  }
}
