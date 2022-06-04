import {Injectable} from "@angular/core";
import {Api} from "./api";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private api: Api) {
    this.api.configureEndpoints();
  }

  async get(url: string, data: any = null) {
    const endpoint = this.api.endpoints.find(x => x.type == 'get' && x.url === url);
    if(endpoint) {
      const result = await endpoint.action(data);
      return result;
    }
  }

  async post(url, data) {
    const endpoint = this.api.endpoints.find(x => x.type == 'post' && x.url === url);
    if(endpoint) {
      const result = await endpoint.action(data);
      return result;
    }
  }

  async delete(url, id) {
    const endpoint = this.api.endpoints.find(x => x.type == 'delete' && x.url === url);
    if(endpoint) {
      const result = await endpoint.action(id);
      return result;
    }

    return Promise.resolve();
  }
}
