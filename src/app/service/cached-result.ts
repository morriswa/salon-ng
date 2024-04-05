import {BehaviorSubject, map, Observable, of, switchMap} from "rxjs";

export default class CachedResult<V> {

    _cachedObject$: BehaviorSubject<V|undefined>;

    constructor() {
      this._cachedObject$ = new BehaviorSubject<V|undefined>(undefined);
    }

    updateCache(value: V) {
      this._cachedObject$.next(value);
    }

    get$() {
      return this._cachedObject$.asObservable();
    }

    getOrThrow(): Observable<V> {
      return this._cachedObject$.asObservable()
        .pipe(map((res)=>{
          if (res) return res;
          else throw new Error("No cached item!");
        }));
    }

    getOr(or: Observable<V>): Observable<V> {
      return this._cachedObject$.asObservable()
        .pipe(switchMap((res: V|undefined): Observable<V>=>{
          if (res) return of(res);
          else return or;
        }));
    }
}
