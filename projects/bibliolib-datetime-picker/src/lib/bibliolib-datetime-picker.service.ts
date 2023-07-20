import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BibliolibDatetimePickerService {

  constructor() { }

  /**
   * @description
   * return a list of hour with the specified start, end and step
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {string[]}
   * @memberof BibliolibDatetimePickerService
  */
  getHourList(start: number = 0, end:number = 23, step: number = 60): string[] {
    let hourList: string[] = [];
    for(let i = 0 ; i <= (end - start) ; i++) {
      let legnth = (60 % step === 0 ? 60 / step : (60 / step + 1) );
      let currentHour = start  != 0 ? start + i  : i;
      for(let j = 0 ; j < legnth ; j++) {
        if(i === (end - start) && j > 0) {
          i++;
          break;
        } else {
          let hour = currentHour < 10 ? '0' + currentHour.toString() : currentHour.toString();
          let minute = (j * step) < 10 ? '0' + (j * step).toString() : (j * step).toString();
          hourList.push(hour + ':' + minute);
        }
      }
    }
    return hourList;
  }
}
