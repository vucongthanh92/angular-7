import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Cashier } from '../../services/models/cashier';
import { isArray } from 'util';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() getCashier: EventEmitter<any> = new EventEmitter();

  public listCashier: Array<Cashier> = [];
  public cashierSID: string;

  constructor(
    private apiService: ApiService
  ) {
    this.listCashier = [];
    this.cashierSID = '';
  }

  ngOnInit() {
    this.getListCashier();
  }

  // ====================== change value input ======================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.cashierSID = '0';
    }
  }

  // ====================== get list cashier ======================
  getListCashier() {
    const params = {
      cols: 'sid,fullname,emplname,employeesubsidiary'
    };
    this.apiService.getCashier(params).subscribe(
      cashiers => {
        if (cashiers) {
          cashiers.data.map(
            (cashier: any) => {
              if (isArray(cashier.employeesubsidiary) && cashier.employeesubsidiary.length > 0) {
                this.listCashier.push({
                  id: cashier.sid,
                  name: cashier.emplname
                });
              }
            }
          );
          this.listCashier.unshift({
            id: '0',
            name: 'All'
          });
          this.cashierSID = this.listCashier[0].id;
        }
      }
    );
  }

  // ====================== send value cashier to search ======================
  onSelectionChanged() {
    this.getCashier.emit(this.cashierSID);
  }
}
