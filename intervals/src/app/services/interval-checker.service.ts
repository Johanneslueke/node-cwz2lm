import { Injectable } from '@angular/core';
import { Observable, zip, mergeMap, toArray, map, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntervalCheckerService {
  constructor() {}

  /**
   * STEP 1: merge both arrays so that each corresponding index pairs up
   * STEP 2: remove the array and treat each item seperatly
   * STEP 3: parse single date and time to get a number representing the time
   * STEP 4: remove the array and treat each item seperatly
   * STEP 5: Map each pair to an object
   * STEP 6: create one singular array containing objects with start,end and duration as property
   * STEP 7: Do the overlap check and return array with the index which are overlapping
   */
  detect(
    start: Observable<Array<string>>,
    duration: Observable<Array<number>>
  ) {
    const zipped = zip(
      //STEP 1: merge both arrays so that each corresponding index pairs up
      start.pipe(
        mergeMap((date) => date), // STEP 2: remove the array and treat each item seperatly
        map((date) => Date.parse(date)) //STEP 3: parse single date and time to get a number representing the time
      ),
      duration.pipe(mergeMap((duration) => duration)) //STEP 4: remove the array and treat each item seperatly
    ).pipe(
      map(([start, duration]) => ({ start, duration, end: start + duration })), //STEP 5: Map each pair to an object
      toArray(), //STEP 6: create one singular array containing objects with start,end and duration as property
      map((data) => {
        // STEP 7: Do the overlap check
        const result: Array<{
          index: number;
          overlapsWith: number;
          // interval: {
          //   start: number;
          //   end: number;
          //   duration: number;
          // };
        }> = [];

        for (const [index, interval] of data.entries()) {
          for (const [key, nextInterval] of data.entries()) {
            const a = interval;
            const b = nextInterval;

            if (
              (a.start >= b.start && a.start < b.end) ||
              (a.end > b.end && a.end <= b.end)
            ) {
              result.push({
                //interval,
                overlapsWith: key,
                index,
              });
            }
          }
        }

        return result.filter((x) => x.index !== x.overlapsWith);
      })
    );

    return zipped;
  }
}
