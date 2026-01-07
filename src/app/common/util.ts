import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
import { Signal } from '@angular/core';

export function createViaAsyncPromiseHttpObservable(
  url: string,
): Observable<any> {
  return new Observable((observer) => {
    const fetchData = async () => {
      try {
        const resp = await fetch(url);
        const body = await resp.json();
        console.log(body);
        observer.next(body.payload);
        observer.complete();
      } catch (error) {
        console.error('error: ', error);
        observer.error(error);
      }
    };
    fetchData();
  });
}

export function createViaPromiseHttpObservable(url: string): Observable<any> {
  return new Observable((observer) => {
    const abortController: AbortController = new AbortController();
    const signal: AbortSignal = abortController.signal;
    fetch(url, { signal })
      .then((response) => {
        console.log('response.json()', response.status);
        if (response.ok) {
          return response.json();
        } else {
          observer.error('Request faild with ' + response.status);
        }
      })
      .then((body) => {
        console.log('body.payload', body.payload);
        observer.next(body.payload);
        observer.complete();
      })
      .catch((error) => {
        console.error('error', error);
        observer.error(error);
      });
    //    return () => abortController.abort()
  });
}

export function createViaObservableHttpObservable(
  obs$: Observable<any>,
): Observable<Course[]> {
  return new Observable((observer) => {
    obs$
      .pipe(map((response) => response['payload']))
      //.pipe(map((response) => Object.values(response['payload'])))
      .subscribe({
        next: (courses) => {
          observer.next(courses);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
  });
}
