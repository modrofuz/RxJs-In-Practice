import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  exhaustMap,
  throttle,
  take,
  first,
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, interval, forkJoin } from 'rxjs';
import { Lesson } from '../model/lesson';
import * as util from '../../../src/app/common/util';
import { HttpClient } from '@angular/common/http';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
import { Store } from '../common/store.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: false,
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: number;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  store = inject(Store);

  @ViewChild('searchInput', { static: false, read: ElementRef })
  input: ElementRef;

  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly httpClient: HttpClient = inject(HttpClient);

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = this.store.selectCourseById(this.courseId);
    /* this.course$ = this.httpClient
      .get<Course>(`/api/courses/${this.courseId}`)
      .pipe(
        //tap((course: Course) => console.log('course', course))
        debug(RxJsLoggingLevel.INFO, 'course'),
      ); */
    //this.lessons$ = this.loadLessons();
    // setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);
  }

  ngAfterViewInit() {
    this.lessons$ = this.searchAhead();
    //this.forkJoin();
    this.withLatestFromExample();
  }

  forkJoin() {
    console.log('forkJoin');
    forkJoin([
      this.course$.pipe(first()),
      this.lessons$.pipe(first()),
    ]) /* .subscribe((tuple) => {
      console.log('tuple', tuple[0], 'tuple', tuple[1]);
    }); */
      .subscribe(([course, lessons]) => {
        console.log('course', course, 'lessons', lessons);
      });
  }

  withLatestFromExample() {
    this.lessons$
      .pipe(withLatestFrom(this.course$.pipe()))
      .subscribe(([lessons, course]) => {
        console.log('course', course, 'lessons', lessons);
      });
  }

  searchAhead() {
    return fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
      startWith(''),
      debug(RxJsLoggingLevel.TRACE, 'searchAhead'),
      //tap((value: string) => console.log(value)),
      debounceTime(200),
      distinctUntilChanged(),
      /* throttle((value: string) => interval(500)), */

      switchMap((searchValue: string) => this.loadLessons(searchValue)),
      debug(RxJsLoggingLevel.DEBUG, 'lessons'),
    );
  }

  loadLessons(searchValue: string): Observable<Lesson[]> {
    return this.httpClient
      .get<{
        payload: Lesson[];
      }>(
        `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchValue}`,
      )
      .pipe(map((res) => res.payload));
  }
}
