import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import {
  concatMap,
  exhaustMap,
  filter,
  fromEvent,
  interval,
  merge,
  mergeMap,
  Observable,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Store } from '../common/store.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false,
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild('saveButton', { static: false, read: ElementRef })
  saveButton!: ElementRef;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  httpClient = inject(HttpClient);
  store = inject(Store);
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    //this.usingConcatMap();
    // this.usingMergeMap();
  }

  ngAfterViewInit() {
    if (this.saveButton) {
      /* fromEvent(this.saveButton.nativeElement, 'click')
        .pipe(
          tap((event) => console.log(event)),
          concatMap(() => this.saveCourse(this.form.value)),
        )*/
      this.usingExhaustMap().subscribe();
    }
  }

  usingMerge() {
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map((val) => val * 10));
    const result$ = merge(interval1$, interval2$);

    result$.subscribe((val) => console.log(val));
  }

  usingConcatMap() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap((changes) => {
          return this.saveCourse(changes);
        }),
      )
      .subscribe((changes) => {
        console.log(changes);
      });
  }

  usingMergeMap() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        mergeMap((changes) => {
          return this.saveCourse(changes);
        }),
      )
      .subscribe((changes) => {
        console.log(changes);
      });
  }

  usingExhaustMap() {
    return fromEvent(this.saveButton.nativeElement, 'click').pipe(
      exhaustMap(() => this.saveCourse(this.form.value)),
    );
  }

  saveCourse(changes): Observable<any> {
    return this.httpClient.put(
      `/api/courses/${this.course.id}`,
      JSON.stringify(changes),
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.store
      .saveCourse(this.course.id, this.form.value)
      .pipe(
        tap(() => this.close()),
        catchError((error) => {
          console.log(error);
          const err = new Error('Save failed');
          throw err;
        }),
      )
      .subscribe();
  }
}
