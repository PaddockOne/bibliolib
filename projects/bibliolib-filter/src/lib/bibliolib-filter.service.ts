import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BibliolibFilterService {

  constructor() { }

  getStartTodayDate(): string {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0, 0).toISOString();
  }
  
  getEndTodayDate(): string {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 25, 59, 0, 0).toISOString();
  }
  
  /** 
   * @description
   * Return the date of the previous day
   * @returns {string} ISO string of the date
   * @example '2020-01-01T00:00:00.000Z'
   */
  getStartYesterdayDate(): string {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 2, 0, 0);   
    return yesterday.toISOString();
  }

  getEndYesterdayDate(): string {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 25, 59, 59);
    return yesterday.toISOString();
  }

  /**
   * @description
   * Return the date of the first day of the current week
   * @returns {string} ISO string of the date
   * @example '2020-01-01T00:00:00.000Z'
  */ 
  getStartWeekDate(): string {
    let date = new Date();
    let day = date.getDay();
    let diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.getFullYear(), date.getMonth(), diff, 2, 0, 0).toISOString();
  }
  /**
   * @description
   * Return the date of the last day of the current week
   * @returns {string} ISO string of the date
   * @example '2020-01-01T23:59:59.000Z'
  */ 
  getEndWeekDate(): string {
    let date = new Date();
    let day = date.getDay();
    let diff = date.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(date.getFullYear(), date.getMonth(), diff, 25, 59, 59).toISOString();
  }
  /**
   * @description
   * Return the date of the first day of the current month
   * @returns {string} ISO string of the date
   * @example '2020-01-01T00:00:00.000Z'
  */ 
  getStartMonthDate(): string {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 2, 0, 0).toISOString();
  }
  /**
   * @description
   * Return the date of the last day of the current month
   * @returns {string} ISO string of the date
   * @example '2020-01-31T23:59:59.000Z'
  */ 
  getEndMonthDate(): string {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 25, 59, 59).toISOString();
  }
  /**
   * @description
   * Return the date of the first day of the current trimester
   * @returns {string} ISO string of the date
   * @example '2020-01-01T00:00:00.000Z'
  */ 
  getStartTrimesterDate(): string {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 2, 1, 2, 0, 0).toISOString();
  }
  /**
   * @description
   * Return the date of the last day of the current trimester
   * @returns {string} ISO string of the date
   * @example '2020-01-31T23:59:59.000Z'
  */ 
  getEndTrimesterDate(): string {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 25, 59, 59).toISOString();
  }
  /**
   * @description
   * Return the date of the first day of the current year
   * @returns {string} ISO string of the date
   * @example '2020-01-01T00:00:00.000Z'
  */ 
  getStartYearDate(): string {
    let date = new Date();
    return new Date(date.getFullYear(), 0, 1, 2, 0, 0).toISOString();
  }
  /**
   * @description
   * Return the date of the last day of the current year
   * @returns {string} ISO string of the date
   * @example '2020-12-31T23:59:59.000Z'
  */ 
  getEndYearDate(): string {
    let date = new Date();
    return new Date(date.getFullYear(), 11, 31, 24, 59, 59).toISOString();
  }
  /**
   * @description
   * Return Formated datetime string
   * @param {string} dateTimeString ISO string of the date
   * @returns {string} Formated datetime string
   * @example '2020-01-01 00:00:00'
  */  
  convertDateTime(dateTimeString: string) {
    const date = new Date(dateTimeString);

    const formattedDate = date.toISOString().split('T')[0];
    date.setHours(date.getHours() - 2);
    const formattedTime = date.toTimeString().split(' ')[0];
    return `${formattedDate} ${formattedTime}`;
  }
}
