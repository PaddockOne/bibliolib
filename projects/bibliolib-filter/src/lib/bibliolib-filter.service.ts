import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BibliolibFilterService {

  constructor() { }

  /**
   * @description
   * Return the date of the current day
   * @returns {string} local date string of the date
   * @example '01/01/2024 00:00:00'
   */
  getStartTodayDate() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const todayLocal = todayStart.toLocaleString(undefined, { timeZone });

    return todayLocal;
  }

  getEndTodayDate() {
    const today = new Date();
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const todayLocal = todayEnd.toLocaleString(undefined, { timeZone });

    return todayLocal;
  }


  /** 
   * @description
   * Return the date of the previous day
   * @returns {string} local date string of the date
   * @example '01/01/2024 00:00:00'
   */
  getStartYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0);
    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const yesterdayLocal = yesterday.toLocaleString(undefined, { timeZone });

    return yesterdayLocal;
  }

  getEndYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const yesterdayLocal = yesterday.toLocaleString(undefined, { timeZone });

    return yesterdayLocal;
  }

  /**
   * @description
   * Return the date of the first day of the current week
   * @returns {string} local date string of the date
   * @example '01/01/2024 00:00:00'
  */
  getStartWeekDate() {
    let date = new Date();
    let day = date.getDay();
    let diff = date.getDate() - day + (day === 0 ? -6 : 1);
    // Créez une nouvelle date avec le fuseau horaire local
    let startOfWeek = new Date(date.getFullYear(), date.getMonth(), diff, 0, 0, 0);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const startOfWeekLocal = startOfWeek.toLocaleString(undefined, { timeZone });

    return startOfWeekLocal;
  }
  /**
   * @description
   * Return the date of the last day of the current week
   * @returns {string} local date string of the date
   * @example '01/01/2024 23:59:59'
  */
  getEndWeekDate() {
    let date = new Date();
    let day = date.getDay();
    let diff = date.getDate() - day + (day === 0 ? 0 : 7);
    // Créez une nouvelle date avec le fuseau horaire local
    let endOfWeek = new Date(date.getFullYear(), date.getMonth(), diff, 23, 59, 59);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const endOfWeekLocal = endOfWeek.toLocaleString(undefined, { timeZone });

    return endOfWeekLocal;
  }
  /**
   * @description
   * Return the date of the first day of the current month
   * @returns {string} local date string of the date
   * @example '01/01/2024 00:00:00'
  */
  getStartMonthDate() {
    let date = new Date();
    // Créez une nouvelle date avec le fuseau horaire local
    let startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const startOfMonthLocal = startOfMonth.toLocaleString(undefined, { timeZone });

    return startOfMonthLocal;
  }
  /**
   * @description
   * Return the date of the last day of the current month
   * @returns {string} local date string of the date
   * @example '31/01/2024 23:59:59'
  */
  getEndMonthDate() {
    let date = new Date();

    // Créez une nouvelle date avec le fuseau horaire local
    let endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const endOfMonthLocal = endOfMonth.toLocaleString(undefined, { timeZone });

    return endOfMonthLocal;
  }
  /**
   * @description
   * Return the date of the first day of the current trimester
   * @returns {string} local date string of the date
   * @example '01/01/2024 00:00:00'
  */
  getStartTrimesterDate() {
    let date = new Date();
    // Créez une nouvelle date avec le fuseau horaire local
    let startOfTrimester = new Date(date.getFullYear(), date.getMonth() - 2, 1, 0, 0, 0);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const startOfTrimesterLocal = startOfTrimester.toLocaleString(undefined, { timeZone });

    return startOfTrimesterLocal;
  }
  /**
   * @description
   * Return the date of the last day of the current trimester
   * @returns {string} local date string of the date
   * @example '31/03/2024 23:59:59'
  */
  getEndTrimesterDate() {
    let date = new Date();
    // Calculez la fin du trimestre en cours
    const currentMonth = date.getMonth();
    const endOfTrimester = new Date(date.getFullYear(), currentMonth + 3 - (currentMonth % 3), 0, 23, 59, 59);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const endOfTrimesterLocal = endOfTrimester.toLocaleString(undefined, { timeZone });

    return endOfTrimesterLocal;
  }
  /**
   * @description
   * Return the date of the first day of the current year
   * @returns {string} local date string of the date
   * @example '01/01/2024 00:00:00'
  */
  getStartYearDate() {
    let date = new Date();
    // Créez une nouvelle date avec le fuseau horaire local
    let startOfYear = new Date(date.getFullYear(), 0, 1, 0, 0, 0);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const startOfYearLocal = startOfYear.toLocaleString(undefined, { timeZone });

    return startOfYearLocal;
  }
  /**
   * @description
   * Return the date of the last day of the current year
   * @returns {string} local date string of the date
   * @example '31/12/2024 23:59:59'
  */
  getEndYearDate() {
    let date = new Date();
    // Créez une nouvelle date avec le fuseau horaire local
    let endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59);

    // Obtenez le nom du fuseau horaire local
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Utilisez toLocaleString avec l'option timeZone
    const endOfYearLocal = endOfYear.toLocaleString(undefined, { timeZone });

    return endOfYearLocal;
  }
}
