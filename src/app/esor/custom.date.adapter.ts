import { Injectable } from "@angular/core";
import {MatDateFormats, NativeDateAdapter} from "@angular/material/core";


@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }

  override parse(value: any, parseFormat?: any): Date | null {
    let dateParts = value.match(/(\d{1,2}).(\d{1,2}).(\d{2,4})/)
    if (dateParts) {
      let day = dateParts[1]
      let month = dateParts[2]
      let year = dateParts[3]
      if (year.length == 2) {
        let currentDate = new Date()
        year = currentDate.getFullYear().toString().slice(0, 2) + year
      }
      let data = new Date(Date.parse(`${year}-${month}-${day}`))
      return data
    }
    let data = super.parse(value)
    return data
  }
}


