import {Session} from "./services/sessions.service";

export abstract class ComponentService {
  abstract getComponentData() : any;
  abstract isLoading() : boolean;
}

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
//                          J   F         M  A  M  J  J  A  S  O  N  D
export const monthLength = [31, undefined,31,30,31,30,31,31,30,31,30,31];

export class Month {
  nextMonthYear: number
  nextMonth: number;

  previousMonthYear: number;
  previousMonth: number;

  monthName: string;

  month: number;
  year: number;
  name:string;
  numberOfDays: number;
  firstDayOfTheMonth: number;
  lastDayOfTheMonth: number;
}

export const getMonths = (year) => {
  const months: Array<Month> = [];

  for (let i = 0; i < 12; i++) {
    let numberOfDays = monthLength[i];

    if(numberOfDays == undefined) {
      numberOfDays = new Date(year, i + 1, 0).getDate();
    }

    months.push({
      nextMonthYear: i == 11 ? year + 1 : year,
      nextMonth: i == 11 ? 0 : (i + 1),
      previousMonthYear: i == 0 ? year - 1 : year,
      previousMonth: i == 0 ? 11 : (i - 1),
      month: i,
      name: monthNames[i],
      year,
      numberOfDays,
      monthName: getMonthName(i),
      firstDayOfTheMonth : new Date(year, i, 1).getDay(),
      lastDayOfTheMonth : new Date(year, i, numberOfDays).getDay()
    })
  }

  return months;
}

export function getMonthName(month: number) {
  return monthNames[month];
}

export interface AirTableEntity {
  airTableId? : string;
}

export class SessionDay {
  day: number;
  year: number;
  month: number;
  date: number;
  isToday: boolean;
  isNotDisplayedMonth: boolean;
  sessions?: Array<Session>;
  firstThreeSessions?: Array<Session>;
}

export interface GetPagedArgs {
  page?: number;
  pageSize?: number;
}
