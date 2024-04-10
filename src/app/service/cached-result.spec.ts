import CachedResult from "./cached-result";

describe('CachedResult', ()=>{

  let cacheTest: CachedResult<String>;

  beforeEach(()=>{
    cacheTest = new CachedResult<String>();
  });

  it('should be created', ()=>{
    cacheTest.get$().subscribe({
      next: (res)=> expect(res).toBe(undefined)
    });
  });

  it('should take valid entries', ()=>{
    cacheTest.updateCacheWith('hello');
    cacheTest
      .get$()
      .subscribe({
        next: (res)=> {
          expect(res).toBe('hello');
        }
      });

    cacheTest.retrieveCacheOrThrow()
      .subscribe((val)=>expect(val).toBe('hello'));
  });

});
