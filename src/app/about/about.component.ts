import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concat, interval, Observable, of, take } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import * as utils from '../../app/common/util';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

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

    // this.combineObservables();
  }

  combineObservables() {
    const source1$ = of(1, 2, 3).pipe(delay(3000));
    const source2$ = of(4, 5, 6);
    const combinedObs$ = concat(source1$, source2$);
    combinedObs$.subscribe((res) => console.log(res));
  }
}






