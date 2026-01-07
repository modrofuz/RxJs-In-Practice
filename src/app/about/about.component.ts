import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AsyncSubject,
  BehaviorSubject,
  concat,
  interval,
  Observable,
  of,
  ReplaySubject,
  Subject,
  take,
} from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import * as utils from '../../app/common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false,
})
export class AboutComponent implements OnInit {
  private readonly httpClient: HttpClient = inject(HttpClient);

  ngOnInit() {
    /*const http$ = utils.createViaPromiseHttpObservable('/api/courses');

    const subs = http$.subscribe({
      next: (resp) => console.log(resp),
    });
      setTimeout(()=> subs.unsubscribe(),0 )*/
    const courses$ = this.httpClient.get('/api/courses'); /*

    const httpAsync = utils.createViaAsyncPromiseHttpObservable('/api/courses');

    const httpPromise = utils.createViaPromiseHttpObservable('/api/courses');

    const httpObservable = utils.createViaObservableHttpObservable(courses$);

    httpPromise.subscribe((res) => console.log('httpPromise', res));
    httpAsync.subscribe((res) => console.log('httpAsync', res));
    httpObservable.subscribe((res) => console.log('httpObservable', res));*/

    //this.combineObservables();
    //this.subject();
    //this.behaviorSubject();
    //this.asyncSubject();
    //this.replySubject();
  }

  combineObservables() {
    const source1$ = of(1, 2, 3).pipe(delay(3000));
    const source2$ = of(4, 5, 6);
    const combinedObs$ = concat(source1$, source2$);
    combinedObs$.subscribe((res) => console.log('combinedObs', res));
  }

  subject() {
    const subject = new Subject<any>();
    subject.next(1);
    subject.next(2);
    const series$ = subject.asObservable();
    series$.subscribe((res) => console.log('subject series', res));
    subject.next(3);
    subject.complete();
  }

  behaviorSubject() {
    const behaviorSubject = new BehaviorSubject<any>(0);
    const series$ = behaviorSubject.asObservable();
    series$.subscribe((res) =>
      console.log('early behaviorSubject series', res),
    );
    behaviorSubject.next(1);
    behaviorSubject.next(2);
    setTimeout(() => {
      series$
        .pipe()
        .subscribe((res) => console.log('late behaviorSubject series', res));
    }, 3000);
    behaviorSubject.next(3);
    behaviorSubject.next(4);
  }

  asyncSubject() {
    const asyncSubject = new AsyncSubject<any>();
    const series$ = asyncSubject.asObservable();
    series$.subscribe((res) => console.log('early asyncSubject series', res));
    asyncSubject.next(1);
    asyncSubject.next(2);
    setTimeout(() => {
      series$
        .pipe()
        .subscribe((res) => console.log('late asyncSubject series', res));
    }, 3000);
    asyncSubject.next(3);
    asyncSubject.next(4);
    asyncSubject.complete();
  }
  replySubject() {
    const replySubject = new ReplaySubject<any>();
    const series$ = replySubject.asObservable();
    series$.subscribe((res) => console.log('early replySubject series', res));
    replySubject.next(1);
    replySubject.next(2);
    setTimeout(() => {
      series$
        .pipe()
        .subscribe((res) => console.log('late replySubject series', res));
    }, 3000);
    replySubject.next(3);
    replySubject.next(4);
  }
}
