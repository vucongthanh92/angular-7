import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() chooseStore: EventEmitter<any> = new EventEmitter();

  public listStores: Array<any>;
  public storeSID: string;

  constructor(
    private apiService: ApiService
  ) {
    this.storeSID = '';
  }

  ngOnInit() {
    this.getStores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.storeSID = '0';
    }
  }

  // ================== get list store ==================
  getStores() {
    const params = {
      cols: 'sid,postdate,storename,storecode,storeno,phone1',
      sort: 'storeno,asc'
    };
    this.apiService.getStores(params).subscribe(
      response => {
        if (response) {
          this.listStores = response.data;
          this.listStores.unshift({
            sid: '0',
            storename: 'All'
          });
          this.storeSID = this.listStores[0].sid;
        }
      }
    );
  }

  // ================== send value store to search ==================
  onSelectionChanged() {
    this.chooseStore.emit(this.storeSID);
  }
}
