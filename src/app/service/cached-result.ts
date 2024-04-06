import {BehaviorSubject, map, Observable, of, switchMap, tap} from "rxjs";

export default class CachedResult<V> {

    private _cachedObject$: BehaviorSubject<V|undefined>;

    constructor() {
      this._cachedObject$ = new BehaviorSubject<V|undefined>(undefined);
    }

    get$() {
      return this._cachedObject$.asObservable();
    }

    updateCacheWith(value: V): void {
      this._cachedObject$.next(value);
    }

    updateCacheWithAndRetrieveValueOf(obs: Observable<V>): Observable<V> {
      return obs.pipe(tap((res:V)=>this._cachedObject$.next(res)));
    }

    retrieveCacheOrThrow(): Observable<V> {
      return this._cachedObject$.asObservable()
        .pipe(map((res)=>{
          if (res) return res;
          else throw new Error("No cached item!");
        }));
    }

    retrieveCacheOrUpdateWith(obs: Observable<V>): Observable<V> {
      return this._cachedObject$.asObservable()
        .pipe(switchMap((res: V|undefined): Observable<V>=>{
          if (res) return of(res);
          else return obs;
        }));
    }
}
