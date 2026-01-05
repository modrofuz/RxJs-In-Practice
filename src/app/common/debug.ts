import { Observable } from "rxjs";
import { tap } from "rxjs/operators";



export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}


let rxJsLoggingLevel = RxJsLoggingLevel.INFO

export const setRxJsLoggingLevel = (level: RxJsLoggingLevel) => {
  rxJsLoggingLevel = level;
};


export const debug = (level: RxJsLoggingLevel, message: string) => (source: Observable<any>) =>
  (source.pipe(
  tap((value) => {
    if (level >= rxJsLoggingLevel) {
      console.log(message+ ': ', value);
    }
  })
))

