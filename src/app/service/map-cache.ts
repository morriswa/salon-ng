import {BehaviorSubject, map, Observable, of, switchMap, throwError} from "rxjs";

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

        let toUpdate = this._cachedObject$.value;
        toUpdate.set(key, value);
        this._cachedObject$.next(toUpdate);

        this._updating$.next(false);
      }

      if (this._updating$.value) {
        setTimeout(()=>this.updateCache(key, value), 500);
        return;
      } else {
        lockedAction();
        return;
      }
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
