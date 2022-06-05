import {Injectable} from "@angular/core";

export class CacheUrlGroup {
  key: any;
  cacheKeys: Array<string>
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  keys: Array<string> = [];
  constructor() {

  }

  cacheData(key: string, data) {
    localStorage.setItem(key, JSON.stringify(data));
    this.keys.push(key);
  }

  clearData(key: string) {
    if(this.getData(key) == undefined) return;
    localStorage.removeItem(key);
    this.keys = this.keys.filter(x => x !== key);
  }

  getData(key: string): any {
    let result = localStorage.getItem(key);

    if(result == null) return undefined;

    const hasKey = this.keys.find(x => x == key);
    if(!hasKey) this.keys.push(key);

    result = JSON.parse(result);
    return result;
  }

  clearGroup(group : CacheUrlGroup) {
    for (let i = 0; i < group.cacheKeys.length; i++) {
      const keys = this.keys.filter(x => x.startsWith(group.cacheKeys[i]));

      if(keys.length) {
        for (let j =0; j < keys.length; j++) {
          this.clearData(keys[j]);
        }
      }
    }
  }
}
