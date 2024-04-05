import MapCache from "./map-cache";

describe('MapCache', ()=>{

  let cacheTest: MapCache<String, String>;

  beforeEach(()=>{
    cacheTest = new MapCache<String, String>();
  });

  it('should be created', ()=>{
    cacheTest.get$().subscribe({
      next: (res)=> expect(res.size).toBe(0)
    });
  });

  it('should take valid entries', ()=>{
    cacheTest.updateCache('hello', 'world');
    cacheTest
      .get$()
      .subscribe({
        next: (res)=> {
          expect(res.size).toBe(1);
          expect(res.get('hello')).toBe('world');
        }
      });

    cacheTest.getOrThrow('hello')
      .subscribe((val)=>expect(val).toBe('world'));
  });

});
