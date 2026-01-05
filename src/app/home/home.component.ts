import { Component, OnInit } from '@angular/core';
import { createViaPromiseHttpObservable } from '../common/util';
import {
  catchError, delayWhen,
  filter,
  finalize,
  interval,
  Observable, retry,
  retryWhen,
  take, timer,
} from 'rxjs';
import { Course } from '../model/course';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    //this.shareReplayExample();

    const courses$: Observable<Course[]> = createViaPromiseHttpObservable(
      '/api/courses',
    ).pipe(
      catchError((err) => {
        console.log('catchError', err);
        throw new Error(err);
      }),
      /*retryWhen((errors) => {
        return errors.pipe(
          delayWhen(() => timer(2000))
        );
      }),*/
      retry({count: 3, delay:2000}),
      finalize(() => console.log('finalized')),
      shareReplay(),
    );
    /*  courses$.subscribe({
      next: (courses: Course[]) => {
        console.log(courses);
      },
      error: noop,
      complete: () => console.log('completed'),
    });*/
    this.advancedCourses$ = courses$.pipe(
      tap((courses: Course[]) => console.log(courses)),
      filter((courses: Course[]) => courses.length > 0),
      map((courses: Course[]) =>
        courses.filter(
          (course) => course.category.toLowerCase() === 'advanced',
        ),
      ),
    );
    this.beginnerCourses$ = courses$.pipe(
      filter((courses: Course[]) => courses.length > 0),
      map((courses: Course[]) =>
        courses.filter(
          (course) => course.category.toLowerCase() === 'beginner',
        ),
      ),
    );
  }

  shareReplayExample() {
    const source$ = interval(1000).pipe(take(7), shareReplay(2)); // Replays the last 2 emitted values
    source$.subscribe((value) => console.log(`Subscriber 1: ${value}`));
    setTimeout(() => {
      source$.subscribe((value) => console.log(`Subscriber 2: ${value}`));
    }, 5000);
  }
}
