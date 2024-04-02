import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class PageService {

  lastPage$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['/']);

  constructor(private router: Router) { }

  // move
  goHome() {
    this.lastPage$.next(this.getUrlAsArray());
    this.router.navigate(['/']).catch(err=>console.error(err));
  }

  goBack() {
    const currentPage = this.getUrlAsArray();

    this.router.navigate(this.lastPage$.value)
      .then(()=>this.lastPage$.next(currentPage))
      .catch(err=>console.error(err));
  }

  change(to: string[]) {
    this.lastPage$.next(this.getUrlAsArray());
    this.router.navigate(to).catch(err=>console.error(err));
  }

  // lookup
  is(page: string) {
    return this.router.url===page;
  }

  isOrSubpageOf(page: string) {
    return this.router.url.startsWith(page);
  }

  isRoot() {
    return this.router.url==='/';
  }

  getRootRoute(): string {
    let url = this.router.url;
    return `${url.substring(1, url.indexOf('/', 1))}`;
  }

  getUrlAsArray() {
    let url = this.router.url;
    const url_arr = url.split('/').filter((value:string)=>value.length > 0);
    if (url_arr.length == 0) return [];
    url_arr[0] = "/"+url_arr[0];
    return url_arr;
  }

  getUrlAt(idx: number): any {
    const url_arr = this.getUrlAsArray();
    if (idx >= url_arr.length) throw new Error(`No ${idx} element`);
    return url_arr[idx];
  }
}
