import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Customer } from '../../services/models/customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() getCustomer: EventEmitter<Customer> = new EventEmitter();

  public customerDivVisible = false;
  public valueSearch: string;
  public keySearch = 'btid';
  public placeholder = 'Customer code';

  constructor() { }

  ngOnInit() {
  }

  // ================== change value input ==================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.valueSearch = '';
      this.keySearch = 'btid';
    }
  }

  // ================== choose type customer ==================
  customerFilter(name: string, placeholder: string) {
    this.keySearch = name;
    this.customerDivVisible = false;
    this.placeholder = placeholder;
    this.onValueChanged();
  }

  // ================== send value customer to search ==================
  onValueChanged() {
    this.getCustomer.emit({
      key: this.keySearch,
      value: this.valueSearch
    });
  }
}
