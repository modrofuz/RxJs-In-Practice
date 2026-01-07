import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer, from } from 'rxjs';
import { Course } from '../model/course';
import {
  delayWhen,
  filter,
  map,
  retryWhen,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import * as util from './util';

@Injectable({
  providedIn: 'root',
})
export class Store {
  private beahviorSubject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.beahviorSubject.asObservable();

  init() {
    console.log('init', this.beahviorSubject.getValue());
    const http$: Observable<Course[]> =
      util.createViaAsyncPromiseHttpObservable('/api/courses');
    http$
      .pipe(
        tap((courses: Course[]) => {
          console.log('HTTP request executed', ' courses: ', courses);
          this.beahviorSubject.next(courses);
        }),
      )
      .subscribe();
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    console.log('selectCourseById');
    return this.courses$.pipe(
      map((courses) => courses.find((course) => course.id == courseId)),
      filter((course) => !!course),
    );
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) =>
        courses.filter(
          (course) => course.category.toLowerCase() == category.toLowerCase(),
        ),
      ),
    );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.beahviorSubject.getValue();
    const courseIndex = courses.findIndex((course) => course.id == courseId);
    // not to mutate, but create a new value
    const newCourses = courses.slice(0); //copy courses array
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };

    this.beahviorSubject.next(newCourses);

    return from(
      fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'content-type': 'application/json',
        },
      }),
    );
  }
}
