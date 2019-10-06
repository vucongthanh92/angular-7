import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DevExtremeModule,
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxTagBoxModule,
  DxFormModule,
  DxSchedulerModule,
  DxMapModule,
  DxTemplateModule,
  DxLoadIndicatorModule,
  DxPieChartModule,
  DxTooltipModule,
  DxTabPanelModule,
  DxPopupModule
} from 'devextreme-angular';

@NgModule({
  declarations: [

  ],

  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DevExtremeModule,
    DxDataGridModule,
    DxButtonModule,
    DxSchedulerModule,
    DxMapModule,
    DxSelectBoxModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTagBoxModule,
    DxTemplateModule,
    DxLoadIndicatorModule,
    DxPieChartModule,
    DxTooltipModule,
    DxTabPanelModule,
    DxPopupModule
  ]
})

export class SharedModule { }
