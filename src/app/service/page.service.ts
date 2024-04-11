import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class PageService {

  pagesVisited: string[][] = [];

  lastPage$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['/']);

  currentPage$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['/']);


  constructor(private router: Router) {
    this.router.events.subscribe(()=>{
      const lastValue = this.currentPage$.value;
      const currentValue = this.getUrlForNav();

      // if the value has changed
      if (lastValue.toString() !== currentValue.toString()) {
        this.currentPage$.next(currentValue);
        this.lastPage$.next(lastValue);
        this.pagesVisited.push(currentValue);
      }
    });
  }


  // move
  goHome() {
    this.router.navigate(['/']).catch(err=>console.error(err));
  }

  goBack() {
    this.router.navigate(this.lastPage$.value).catch(err=>console.error(err));
  }

  change(to: any[]) {
    this.router.navigate(to).catch(err=>console.error(err));
  }

  // lookup
  is(page: string) {
    return this.router.url===page;
  }

  hasRoot(page: string) {
    return this.router.url.startsWith(page);
  }

  isRoot() {
    return this.router.url==='/';
  }

  getRootRoute(): string|undefined {
    let url = this.getUrl();
    if (url.length > 0) return url[0];
    else return undefined;
  }

  getUrlForNav(): string[] {
    let url_arr = this.getUrl();
    if (url_arr.length==0) return ['/'];
    url_arr[0] = "/"+url_arr[0];
    return url_arr;
  }

  getUrl(): string[] {
    let url = this.router.url;
    const url_arr = url.split('/').filter((value:string)=>value.length > 0);
    if (url_arr.length == 0) return [];
    return url_arr;
  }

  getUrlSegmentOrThrow(idx: number): string {
    const url_arr = this.getUrlForNav();
    if (idx >= url_arr.length) throw new Error(`No ${idx} element`);
    return url_arr[idx];
  }

  getUrlSegmentElse(idx: number, orElse: string): string {
    const url_arr = this.getUrlForNav();
    if (idx >= url_arr.length) return orElse;
    return url_arr[idx];
  }

  lastInstanceOfPrefix(prefix: any[]): string[] | undefined {
    let pageHistory = this.pagesVisited;
    pageHistory.reverse();

    for (const url of pageHistory) {
      if (url.length >= prefix.length) {
        let idx = 0;
        let matches = true;
        for (const link of url) {
          if (idx===prefix.length) break;
          if (link!==prefix[idx]) {
            matches = false;
          }
          idx++;
        }
        if (matches) return url;
      }
    }

    return undefined;
  }

  subpageOf(s: string) {
    return this.router.url.startsWith(s);
  }
}
