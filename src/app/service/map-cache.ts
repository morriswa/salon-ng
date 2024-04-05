import {BehaviorSubject, map, Observable, of, switchMap, takeWhile, } from "rxjs";

export default class MapCache<K, V> {

    _updating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    _cachedObject$: BehaviorSubject<Map<K, V>>;

    constructor() {
      let createdMap = new Map<K, V>();
      this._cachedObject$ = new BehaviorSubject<Map<K, V>>(createdMap);
    }

    updateCache(key: K, value: V) {
      const lockedAction = () => {

        this._updating$.next(true);

        let res = this._cachedObject$.value;
        res.set(key, value);
        this._cachedObject$.next(res);

        this._updating$.next(false);
      }

      this._updating$.asObservable()
        .pipe(takeWhile(value => !value))
        .subscribe((locked)=>{
          if (!locked) lockedAction();
        });
    }

    get$() {
      return this._cachedObject$.asObservable();
    }

    getOrThrow(key: K): Observable<V> {
      return this._cachedObject$.asObservable()
        .pipe(map((res)=>{
          const result = res.get(key);
          if (result) return result;
          else throw new Error("No matching key");
        }));
    }

    getOr(key: K, or: Observable<V>): Observable<V> {
      return this._cachedObject$.asObservable()
        .pipe(switchMap((res)=>{
          const result = res.get(key);
          if (result) return of(result);
          else return or;
        }));
    }

}
