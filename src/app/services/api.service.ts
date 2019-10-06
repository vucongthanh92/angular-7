import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CustomService } from './custom.service';

import { Login } from '../services/models/login';
import { Search } from '../services/models/search';
import { Setting } from '../services/models/setting';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private localAPI = environment.local;
  private serverAPI = environment.server;
  private api: any;

  constructor(
    private httpClient: HttpClient,
    private customService: CustomService
  ) {
    this.api = this.customService.api;
  }

  // =========================== login ===========================
  login(params: Login) {
    const headersRequest = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const bodyRequest: any = params;

    const requestOption = new HttpRequest<any>('POST',
      this.localAPI + this.api.login, bodyRequest, {
        headers: headersRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // =========================== get store for search form ===========================
  getStores(params: any) {
    const paramsRequest = new HttpParams()
      .set('cols', params.cols)
      .set('sort', params.sort);
    const headersRequest = new HttpHeaders();
    const bodyRequest: any = null;
    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getStores, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });
    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // =========================== get cashier for search form ===========================
  getCashier(params: any) {
    const paramsRequest = new HttpParams()
      .set('cols', params.cols);
    const headersRequest = new HttpHeaders();
    const bodyRequest: any = null;

    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getCashiers, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // =========================== get workstation for search form ===========================
  getWorkStations(params: any) {
    const paramsRequest = new HttpParams()
      .set('cols', params.cols)
      .set('filter', '(workstation_type,eq,0)');
    const headersRequest = new HttpHeaders();
    const bodyRequest: any = null;

    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getWorkStations, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // ============================== get list receipt by search ==============================
  getReceipts(params: Search, cols: string = '*,docitem.*', sort: string = 'postdate,desc') {
    let filterParams = '(invcpostdate,nn)';
    switch (params.receiptType) {
      case '0':
        filterParams += '(sid,nn)';
        break;
      case '1':
        filterParams += '(receipttype,nn)';
        break;
      case '2':
        filterParams += 'AND(ordertype,eq,0)';
        break;
      default:
        break;
    }

    if (params.store && params.store !== '0') {
      filterParams += 'AND(storesid,eq,' + params.store + ')';
    }
    if (params.date && params.date.fromDate) {
      const fromdate = this.customService.addTimeZoneBrowser(
        params.date.fromDate,
        Number(sessionStorage.getItem('timezone-browser'))
      );
      filterParams += 'AND(postdate,ge,' + fromdate + ')';
    }
    if (params.date && params.date.toDate) {
      const todate = this.customService.addTimeZoneBrowser(
        params.date.toDate,
        Number(sessionStorage.getItem('timezone-browser'))
      );
      filterParams += 'AND(postdate,le,' + todate + ')';
    }
    if (params.receiptNumber && params.receiptNumber !== '') {
      filterParams += 'AND(docno,eq,' + params.receiptNumber + ')';
    }
    if (params.cashier && params.cashier !== '0') {
      filterParams += 'AND(cashiersid,eq,' + params.cashier + ')';
    }
    if (params.customer && params.customer.key && params.customer.value) {
      filterParams += 'AND(' + params.customer.key + ',eq,' + params.customer.value + ')';
    }
    if (params.workstation && params.workstation !== '0') {
      filterParams += 'AND(workstationuid,eq,' + params.workstation + ')';
    }
    if (params.refund) {
      filterParams += 'AND(hasreturn,eq,1)';
    }

    const paramsRequest = new HttpParams()
      .set('cols', cols)
      .set('filter', filterParams)
      .set('sort', sort);
    const headersRequest = new HttpHeaders();
    const bodyRequest: any = null;

    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getDocuments, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // ============================== get list images by receipt ==============================
  getImagesByReceipt(params: any) {
    const paramsRequest = new HttpParams()
      .set('start', params.start)
      .set('end', params.end);
    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getImages, {
        params: paramsRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // ============================== get timezone by storecode and pos ==============================
  getTimeZone(params: any) {
    const paramsRequest = new HttpParams()
      .set('storecode', params.storecode)
      .set('pos', params.pos);

    const headersRequest = new HttpHeaders();
    const bodyRequest: any = null;

    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getTimeZone, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // ============================== get setting by ID ==============================
  getSettingByID(id: any) {
    const paramsRequest = new HttpParams();
    const headersRequest = new HttpHeaders();
    const bodyRequest: any = null;

    const requestOption = new HttpRequest<any>('GET',
      this.localAPI + this.api.getSettingByID + '/' + id, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });

    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }

  // =========================== update setting by ID ===========================
  updateSettingByID(params: Setting) {
    const paramsRequest = new HttpParams();
    const headersRequest = new HttpHeaders();
    const bodyRequest: any = {
      StoreCode: params.StoreCode,
      CameraName: params.CameraName,
      Pos: params.Pos,
      CameraIp: params.CameraIp,
      CameraFtpFolder: params.CameraFtpFolder,
      TimeZoneOffset: params.TimeZoneOffset,
      TimeZone: params.TimeZone,
      Position: params.Position
    };
    const requestOption = new HttpRequest<any>('PUT',
      this.localAPI + this.api.updateSettingByID + '/' + this.customService.settingID, bodyRequest, {
        headers: headersRequest,
        params: paramsRequest,
        responseType: 'json',
      });
    return this.httpClient.request(requestOption)
      .pipe(
        map(
          response => {
            const result = response as HttpResponse<any>;
            return result.body;
          })
      );
  }
}
