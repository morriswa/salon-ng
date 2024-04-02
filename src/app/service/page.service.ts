import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class PageService {

  lastPage$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['/']);

  constructor(private router: Router) { }

  // move
  goHome() {
    this.lastPage$.next(this.getUrlForNav());
    this.router.navigate(['/']).catch(err=>console.error(err));
  }

  goBack() {
    const currentPage = this.getUrlForNav();

    this.router.navigate(this.lastPage$.value)
      .then(()=>this.lastPage$.next(currentPage))
      .catch(err=>console.error(err));
  }

  change(to: string[]) {
    this.lastPage$.next(this.getUrlForNav());
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
    url_arr[0] = "/"+url_arr[0];
    return url_arr;
  }

  getUrl(): string[] {
    let url = this.router.url;
    const url_arr = url.split('/').filter((value:string)=>value.length > 0);
    if (url_arr.length == 0) return [];
    return url_arr;
  }

  getUrlAt(idx: number): string {
    const url_arr = this.getUrlForNav();
    if (idx >= url_arr.length) throw new Error(`No ${idx} element`);
    return url_arr[idx];
  }
}
