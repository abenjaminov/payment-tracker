import {Injectable} from "@angular/core";
import {Api, apiVersion} from "./api";
import {CacheService} from "./cache";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Just a test
  constructor(private api: Api, public cache: CacheService) {
    this.api.configureEndpoints();
  }

  async get(url: string, data: any = null) {
    const endpoint = this.api.endpoints.find(x => x.type == 'get' && x.url === url);
    if(endpoint) {
      const result = await endpoint.action(this, data);
      return result;
    }
  }

  async post(url, data) {
    const endpoint = this.api.endpoints.find(x => x.type == 'post' && x.url === url);
    if(endpoint) {
      const result = await endpoint.action(this, data);
      return result;
    }
  }

  async delete(url, id) {
    const endpoint = this.api.endpoints.find(x => x.type == 'delete' && x.url === url);
    if(endpoint) {
      const result = await endpoint.action(this, id);
      return result;
    }
  }

  async isVersionMatching() {
    const versionEndpoint = this.api.endpoints.find(x => x.url === 'version');
    const updatedVersion = await versionEndpoint.action();

    let result = apiVersion !== updatedVersion;
    return result;
  }
}
