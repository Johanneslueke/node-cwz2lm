import { Injectable } from '@angular/core';
import { Observable, zip, mergeMap, toArray, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntervalCheckerService {
  constructor() {}

  detect(
    start: Observable<Array<string>>,
    duration: Observable<Array<number>>
  ) {
    const zipped = zip(
      start.pipe(
        mergeMap((date) => date),
        map((date) => Date.parse(date))
      ),
      duration.pipe(mergeMap((duration) => duration))
    ).pipe(
      map(([start, duration]) => ({ start, duration, end: start + duration })),
      toArray(),
      map((data) => {
        const result: Array<{
          index: number;
          overlapsWith: number;
          interval: {
            start: number;
            end: number;
            duration: number;
          };
        }> = [];

        for (const [index, interval] of data.entries()) {
          const dataWithoutItself = [...data.entries()];
          //dataWithoutItself.splice(index,1);

          for (const [key, nextInterval] of dataWithoutItself) {
            if (
              (interval.start > nextInterval.start &&
                interval.start < nextInterval.end) ||
              (interval.end > nextInterval.end &&
                interval.end < nextInterval.end)
            ) {
              result.push({
                interval,
                overlapsWith: key,
                index,
              });
            }
          }
        }
        return result;
      })
    );

    return zipped;
  }
}
