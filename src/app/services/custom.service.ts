import { Injectable } from '@angular/core';
import { Login } from '../services/models/login';
import { Receipt } from '../services/models/receipt';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CustomService {

  // ================== api list ==================
  public api: any = {
    login: '/Login',
    getStores: '/GetStoresList',
    getDocuments: '/GetDocumentsList',
    getCashiers: '/GetCashierList',
    getImages: '/GetImagesList',
    getWorkStations: '/GetWorkStation',
    getTimeZone: '/GetAllSettings',
    getSettingByID: '/GetSettingById',
    updateSettingByID: '/UpdateSetting'
  };

  public receiptTypeList = [
    {
      id: '0',
      text: 'All'
    },
    {
      id: '1',
      text: 'Receipt'
    },
    {
      id: '2',
      text: 'Sale Order'
    }
  ];

  private formatDateTime: string;
  public settingID: string;

  constructor() {
    this.settingID = '1';
  }

  // ================== set formate datetime ==================
  setFormatDateTime() {
    this.formatDateTime = 'YYYY-MM-DD HH:mm:ss';
  }

  // ================== get formate datetime ==================
  getFormatDateTime() {
    return this.formatDateTime;
  }

  // ======================== remove timezone and format datetime ========================
  getColsApiSearchReceipt() {
    return 'sid,docno,btid,postdate,ordereddate,invcpostdate,storename,storecode,storesid,'
      + 'takenamt,ordersubtotal,givenamt,hasreturn,receipttype,btfirstname,btlastname,'
      + 'workstationno,workstationuid,workstationname,docitem.alu,docitem.itemtype,'
      + 'docitem.sid,docitem.price,docitem.postdate,docitem.description1,docitem.qty,';
  }

  // ======================== check login ========================
  checkLogin(login: Login) {
    const error: any = {
      status: 0,
      message: ''
    };
    if (!login.Username || login.Username === '') {
      error.status = 1;
      error.message = 'Username can not blank';
    }
    if (!login.Password || login.Password === '') {
      error.status = 1;
      error.message = 'Password can not blank';
    }
    return error;
  }

  // ================== remove timezone and format datetime ==================
  removeTimeZone(value: string) {
    const valueTime = moment(value).format();
    const result = valueTime.slice(0, valueTime.lastIndexOf('+'));
    return result;
  }

  // ==================== convert time to number ====================
  convertTimeToNumber(value: string) {
    const valueTime = moment(value).unix();
    return Number(valueTime);
  }

  // ====================== convert time receipt ======================
  convertTimeReceipt(value: string) {
    const strName = this.removeTimeZone(value);
    return strName.replace('T', ' ');
  }

  // ====================== get timezone browser ======================
  getTimeZoneBrowser() {
    return ((new Date().getTimezoneOffset()) / 60).toString();
  }

  // ==================== convert unix time by pattern ====================
  convertUnixTimeByPattern(value: number = 0, pattern: string = 'mm:ss') {
    const tempTime = moment.unix(value).format(pattern);
    return tempTime;
  }

  // ====================== convert datetime by pattern ======================
  convertDateTimeByPattern(value: string, pattern: string = 'YYYY-MM-DD HH:mm:ss') {
    const tempTime = moment(value).format(pattern);
    return tempTime;
  }

  // ====================== add timezone browser ======================
  addTimeZoneBrowser(value: string, hour: number = 0, pattern = '') {
    let convertTime = '';
    if (pattern === '') {
      convertTime = moment(value).format();
      convertTime = moment(convertTime).add(hour, 'hour').format();
      convertTime = this.removeTimeZone(convertTime);
    } else {
      convertTime = this.convertDateTimeByPattern(value, pattern);
      convertTime = moment(convertTime, pattern).add(hour, 'hour').format(pattern);
    }
    return convertTime;
  }

  // ====================== sort array by parameter ======================
  filterReceipt(dataReceipt: Array<Receipt>, keyword: string, field: string) {
    let resultReceipts: Array<Receipt> = [];
    keyword = keyword.toLowerCase();
    resultReceipts = dataReceipt.filter(
      receipt => {
        if (receipt[field]) {
          const receiptTemp = receipt[field].toString();
          if (receiptTemp.search(keyword) !== -1) {
            return receipt;
          }
        }
      }
    );
    return resultReceipts;
  }
}
