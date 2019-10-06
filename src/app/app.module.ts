import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutingModule } from './app-routing.module';
import { SortPipe } from './services/pipe/sort.pipe';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { DateComponent } from './receipt-search/date/date.component';
import { ReceiptNumberComponent } from './receipt-search/receipt-number/receipt-number.component';
import { CustomerComponent } from './receipt-search/customer/customer.component';
import { StoreComponent } from './receipt-search/store/store.component';
import { CashierComponent } from './receipt-search/cashier/cashier.component';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { DisplayComponent } from './receipt-video/display/display.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { LoginComponent } from './login/login.component';
import { ItemsComponent } from './receipt-item/items/items.component';
import { DetailComponent } from './receipt-video/detail/detail.component';
import { MessageComponent } from './receipt-video/message/message.component';
import { TimelineComponent } from './receipt-video/timeline/timeline.component';
import { LivecamComponent } from './receipt-video/livecam/livecam.component';
import { SettingComponent } from './setting/setting.component';

import { DeferLoadModule } from '@trademe/ng-defer-load';
import { Ng5SliderModule } from 'ng5-slider';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ReceiptTypeComponent } from './receipt-search/receipt-type/receipt-type.component';
import { RefundComponent } from './receipt-search/refund/refund.component';
import { WorkstationComponent } from './receipt-search/workstation/workstation.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
   declarations: [
      AppComponent,
      DateComponent,
      ReceiptNumberComponent,
      CustomerComponent,
      StoreComponent,
      CashierComponent,
      ReceiptViewComponent,
      DisplayComponent,
      ReceiptListComponent,
      ItemsComponent,
      LoginComponent,
      ReceiptTypeComponent,
      RefundComponent,
      WorkstationComponent,
      DetailComponent,
      MessageComponent,
      TimelineComponent,
      LivecamComponent,
      SettingComponent,
      SortPipe
   ],
   imports: [
      BrowserModule,
      SharedModule,
      RoutingModule,
      Ng5SliderModule,
      DeferLoadModule,
      DxLoadPanelModule,
      NgxPaginationModule
   ],
   providers: [
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
