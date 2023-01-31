import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Observable, of, tap } from 'rxjs';

import { IntervalCheckerService } from './interval-checker.service';

describe('IntervalCheckerService', () => {
  let service: IntervalCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervalCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const intervalData = [
    // {
    // 	start: of(['01.01.2023 00:00', '02.01.2023 00:00'] as string[]),
    // 	duration: of([1, 1] as number[]),
    // 	expected: [],
    // },
    {
      start: of(['01.01.2023 00:00', '01.01.2023 00:30'] as string[]),
      duration: of([1, 1] as number[]),
      expected: [
        {
          index: 0,
          overlapsWith: 1,
          Interval: {
            start: Date.parse('01.01.2023 00:00'),
            end: Date.parse('01.01.2023 00:00') + 1,
            duration: 1,
          },
        },
      ],
    },
  ];

  it.each(intervalData)(
    'should detect overlaps',
    async ({
      start,
      duration,
      expected,
    }: {
      start: Observable<Array<string>>;
      duration: Observable<Array<number>>;
      expected: any;
    }) => {
      const actual = service.detect(duration, start).pipe(tap(console.error));

      await expect(firstValueFrom(actual)).resolves.toEqual(
        expect.arrayContaining(expected)
      );
    }
  );
});
