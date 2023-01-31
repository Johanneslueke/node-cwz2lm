import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Observable, of, tap } from 'rxjs';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
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

  // it('should detect overlaps A and B are the same (a,b)-----|', async () => {
  //   const sourceA = cold('--x|', { x: [1, 1] });
  //   const sourceB = cold('--x|', {
  //     x: ['01.01.2023 00:00', '01.01.2023 00:00'],
  //   });
  //   const expected = cold('--x|', {
  //     x: [
  //       {
  //         index: 0,
  //         overlapsWith: 1,
  //         // Interval: {
  //         //   start: Date.parse('01.01.2023 00:00'),
  //         //   end: Date.parse('01.01.2023 00:00') + 1,
  //         //   duration: 1,
  //         // },
  //       },
  //       {
  //         index: 1,
  //         overlapsWith: 0,
  //       },
  //     ],
  //   });

  //   expect(service.detect(sourceB, sourceA)).toBeObservable(expected);
  // });

  // it('should detect overlaps B begins in A (a)----(b)---|----|', async () => {
  //   const sourceA = cold('--x|', { x: [1000 * 60, 1000 * 60] });
  //   const sourceB = cold('--x|', {
  //     x: ['01.01.2023 00:00', '01.01.2023 00:00:30'],
  //   });
  //   const expected = cold('--x|', {
  //     x: [
  //       {
  //         index: 0,
  //         overlapsWith: 1,
  //         // Interval: {
  //         //   start: Date.parse('01.01.2023 00:00'),
  //         //   end: Date.parse('01.01.2023 00:00') + 1,
  //         //   duration: 1,
  //         // },
  //       },
  //       {
  //         index: 1,
  //         overlapsWith: 0,
  //       },
  //     ],
  //   });

  //   expect(service.detect(sourceB, sourceA)).toBeObservable(expected);
  // });

  // it('should detect overlaps B begin at A.end (a)----(b)----|', async () => {
  //   const sourceA = cold('--x|', { x: [1000 * 60, 1000 * 30] });
  //   const sourceB = cold('--x|', {
  //     x: ['01.01.2023 00:00:00', '01.01.2023 00:00:30'],
  //   });
  //   const expected = cold('--x|', {
  //     x: [
  //       {
  //         index: 0,
  //         overlapsWith: 1,
  //       },
  //       {
  //         index: 1,
  //         overlapsWith: 0,
  //       },
  //     ],
  //   });

  //   expect(service.detect(sourceB, sourceA)).toBeObservable(expected);
  // });

  it('should detect overlaps B begin at A.end (a)----| (b)----|', async () => {
    let diagram = {
      sourceA_: '(ab)---|',
      expected: '----x--|',
    };
    const sourceA = cold(diagram.expected, {
      a: [Date.parse('01.01.2023 00:00:00'), 1000 * 60],
      b: [Date.parse('01.01.2023 00:30:00'), 1000 * 60],
    });
    const expected = cold(diagram.expected, {
      x: [],
    });

    expect(service.detect(sourceA)).toBeObservable(expected);
  });

  it('should zip arrays into array of pairs', async () => {
    let diagram = {
      sourceA_: 'a---|',
      sourceB_: 'b---|',
      expected: '(ab)|',
    };
    const sourceA = hot(diagram.sourceA_, { a: [1000 * 60, 1000 * 60] });
    const sourceB = hot(diagram.sourceB_, {
      b: ['01.01.2023 00:00:00', '01.01.2023 00:30:00'],
    });
    const expected = cold(diagram.expected, {
      a: [Date.parse('01.01.2023 00:00:00'), 1000 * 60],
      b: [Date.parse('01.01.2023 00:30:00'), 1000 * 60],
    });

    expect(service.zipIntervals(sourceB, sourceA)).toBeObservable(expected);
  });

  it('should merge zipped', async () => {
    let diagram = {
      sourceA_: 'a-b|',
      expected: '(x)|',
    };
    const sourceA = hot(diagram.sourceA_, {
      a: [Date.parse('01.01.2023 00:00:00'), 1000 * 60],
      b: [Date.parse('01.01.2023 00:30:00'), 1000 * 60],
    });

    const expected = cold(diagram.expected, {
      x: [
        [
          {
            start: Date.parse('01.01.2023 00:00:00'),
            duration: 1000 * 60,
            end: Date.parse('01.01.2023 00:00:00') + 1000 * 60,
          },
          {
            start: Date.parse('01.01.2023 00:30:00'),
            duration: 1000 * 60,
            end: Date.parse('01.01.2023 00:30:00') + 1000 * 60,
          },
        ],
      ],
    });

    expect(service.mergeZipAndGroup(sourceA)).toBeObservable(expected);
  });
});
