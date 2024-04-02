import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class PageService {
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/']).catch(err=>console.error(err));
  }

  change(to: string[]) {
    this.router.navigate(to).catch(err=>console.error(err));
  }

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

  getUrlAt(idx: number): any {
    let url = this.router.url;
    const url_arr = url.split('/').filter((value:string)=>value.length > 0);
    if (idx >= url_arr.length) throw new Error(`No ${idx} element`);
    return url_arr[idx];
  }
}
