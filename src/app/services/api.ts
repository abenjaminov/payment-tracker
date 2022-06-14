import * as Airtable from "airtable";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {AirtableBase} from "airtable/lib/airtable_base";
import {FieldSet, Records, Table} from "airtable";
import {Client, GetClientsArgs} from "./client.service";
import {GetSessionArgs, Session, SessionPaymentState, SessionPaymentStateServer} from "./sessions.service";
import {AirTableEntity, GetMonthlyRevenueArgs} from "../models";
import {ApiService} from "./api.service";
import {CacheUrlGroup} from "./cache";

export const apiVersion: string = '1.1.0';

enum CacheUrlGroupKey {
  sessionsSaved
}

let cacheGroups: { [ key: number] : CacheUrlGroup;} = {
  0 : {
    key: CacheUrlGroupKey.sessionsSaved,
    cacheKeys : ['monthly-revenue', 'this-month-revenue', 'future-revenue','total-debt']
  }
}

export class GetArgs {
  page: number;
}

export class ApiEndpoint {
  url: string;
  data?: any;
  action?: any;
  type: string;
}

class Identifiers implements AirTableEntity{
  Id: string;
  nextSessionId: number;
  nextClientId: number;
  airTableId? : string;
}

@Injectable({providedIn: 'root'})
export class Api {
  endpoints: Array<ApiEndpoint>

  airtableBase: AirtableBase;

  clientsTable: Table<FieldSet>;
  sessionsTable: Table<FieldSet>;
  queriesTable: Table<FieldSet>;
  identifiersTable: Table<FieldSet>;

  queryRecordId: string;

  constructor() {
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: environment.airtableApiKey
    })
    this.airtableBase = Airtable.base(environment.airtableBaseId);

    this.clientsTable = this.airtableBase('Clients')
    this.sessionsTable = this.airtableBase('Sessions')
    this.queriesTable = this.airtableBase('Queries')
    this.identifiersTable = this.airtableBase('Identifiers')
  }

  async updateIdentifiers(identifiers: Identifiers) {
    let update = {
      id : identifiers.airTableId,
      fields: {
        Id: identifiers.Id,
        nextSessionId: identifiers.nextSessionId,
        nextClientId: identifiers.nextClientId
      }
    }
    await this.identifiersTable.update([update])
  }

  async getNextSessionId() {
    let selectResult = await this.identifiersTable.select({view: "Grid view"}).firstPage();
    let identifiers : Identifiers = this.getViewObject(selectResult)[0];
    let result = identifiers.nextSessionId;

    identifiers.nextSessionId++;

    await this.updateIdentifiers(identifiers);

    return result;
  }

  async getNextClientId() {
    let selectResult = await this.identifiersTable.select({view: "Grid view"}).firstPage();
    let identifiers : Identifiers = this.getViewObject(selectResult)[0];
    let result = identifiers.nextClientId;

    identifiers.nextClientId++;

    await this.updateIdentifiers(identifiers);

    return result;
  }

  async getQueriesRecordId() {
    if(!this.queryRecordId) {
      let selectResult = await this.queriesTable.select({
        view: 'Grid view'
      }).firstPage();
      this.queryRecordId = selectResult[0].id;
    }

    return this.queryRecordId;
  }

  getViewObject(records : Records<FieldSet>) {
    const objects = [];
    for(let record of records) {
      const airTableEntity = record._rawJson.fields;
      airTableEntity.airTableId = record.id;
      objects.push(airTableEntity)
    }

    return objects;
  }

  configureEndpoints() {
    this.endpoints = [];
    this.endpoints.push({url: 'clients',type: 'get',
      action: async (apiService: ApiService, filter: GetClientsArgs) => {
        let pageSize = filter && filter.pageSize ? filter.pageSize : 100;

        let filterFormula = '';
        let result: any[];
        if(filter && filter.filterId) {
          const findResult = await this.clientsTable.find(filter.filterId);
          result = this.getViewObject([findResult]);
        }
        else {
          if(filter) {
            const conditions = [];
            if(filter.filterText) {
              let lowerFilter = filter.filterText.toLowerCase();
              conditions.push(`OR(FIND({name},'${lowerFilter}') != 0,FIND({notes},'${lowerFilter}') != 0`)
            }

            conditions.push(`FLOOR({id} / ${pageSize}) = ${filter.page - 1}`);

            filterFormula = `AND(${conditions.join(",")})`;
          }

          const selectResult = await this.clientsTable.select({
            pageSize: 20,
            offset: 0,
            view: 'Grid view',
            filterByFormula: filterFormula
          }).firstPage();

          result = this.getViewObject(selectResult);
        }

        return result
      }
    },{ url: 'sessions', type: 'get',
      action : async (apiService: ApiService, filter: GetSessionArgs) => {
        let filterFormula = '';

        let pageSize = filter && filter.pageSize ? filter.pageSize : 100;

        if(filter) {
          const conditions = [];

          if(filter.filterMonth !== undefined) {
            conditions.push(`{month} = ${filter.filterMonth + 1}`);
          }

          if(filter.filterPaymentYear && filter.filterPaymentMonth !== undefined) {
            conditions.push(`{paymentMonth} = ${filter.filterPaymentMonth + 1}`);
            conditions.push(`{paymentYear} = ${filter.filterPaymentYear}`);
          }

          if(filter.filterClientId !== undefined) {
            conditions.push(`{clientIdRef}&'' = '${filter.filterClientId}'`);
          }

          if(filter.filterPaymentState !== undefined) {
            conditions.push(`{paymentState} = '${SessionPaymentState[filter.filterPaymentState]}'`)
          }

          if(filter.filterText) {
            let lowerFilter = filter.filterText.toLowerCase();
            conditions.push(`OR(FIND('${lowerFilter}', LOWER({notes})),FIND('${lowerFilter}', LOWER({clientName}&'')))`)
          }

          if(filter.page) {
            conditions.push(`FLOOR({id} / ${pageSize}) = ${filter.page - 1}`);
          }

          filterFormula = `AND(${conditions.join(",")})`;
        }

        const selectResult = await this.sessionsTable.select({
          pageSize: pageSize,
          view: 'Grid view',
          filterByFormula: filterFormula,
          sort: [{ field: 'date', direction: 'desc' }]
        }).firstPage();

        const result = this.getViewObject(selectResult);

        return result;
      }
    },{url: 'this-month-revenue', type: 'get',
      action: async (apiService: ApiService) => {
        const cacheKey = `this-month-revenue;${new Date().getMonth()}`;
        let revenue = apiService.cache.getData(cacheKey);

        if(revenue !== undefined) return revenue;

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: ['thisMonthRevenue'],
        }).firstPage();

        let result = this.getViewObject(selectResult);

        revenue = result[0]['thisMonthRevenue'];

        apiService.cache.cacheData(cacheKey, revenue);

        return revenue;
      }
    },{ url: 'monthly-revenue', type: 'get',
        action: async (apiService: ApiService, args : GetMonthlyRevenueArgs) => {
          const cacheKey = `monthly-revenue;${args.month};${args.year}`;
          let revenue = apiService.cache.getData(cacheKey);

          if(revenue !== undefined) return revenue;

          const getSessionArgs: GetSessionArgs = {
            filterPaymentMonth: args.month,
            filterPaymentYear: args.year
          };
          let sessionsInMonth: Array<any> = await apiService.get('sessions', getSessionArgs);

          revenue = sessionsInMonth.reduce((accumulator, curr) => {
              if(curr.paymentState == SessionPaymentStateServer.payed)
                return accumulator + curr.payment
              else {
                return accumulator;
              }
          }, 0);

          apiService.cache.cacheData(cacheKey, revenue);

          return revenue;
        }
      },
      {url: 'debt', type: 'get',
      action: async (apiService: ApiService) => {

        const cacheKey = `total-debt;`;
        let debt = apiService.cache.getData(cacheKey);

        if(debt !== undefined) return debt;

        let filterFormula = '';

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: ['debt'],
          filterByFormula: filterFormula
        }).firstPage();

        let result = this.getViewObject(selectResult);
        debt = result[0]['debt'];
        apiService.cache.cacheData(cacheKey, debt);

        return debt;
      }
    },{
      url: 'future-revenue',
      type: 'get',
      action: async (apiService: ApiService) => {
        const cacheKey = `future-revenue;`;
        let futureRevenue = apiService.cache.getData(cacheKey);

        if(futureRevenue !== undefined) return futureRevenue;

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: ['futureRevenue']
        }).firstPage();

        let result = this.getViewObject(selectResult);

        futureRevenue = result[0]['futureRevenue'];
        apiService.cache.cacheData(cacheKey, futureRevenue);

        return futureRevenue;
      }
    },{
        url: 'version',
        type: 'get',
        action: async (apiService: ApiService) => {
          const selectResult = await this.identifiersTable.select({
            view: 'Grid view',
            fields: ['version']
          }).firstPage();

          let result = this.getViewObject(selectResult);

          const version = result[0]['version'];

          return version;
        }
      },{ url: 'sessions', type: 'post',
      action: async (apiService: ApiService, sessions: Array<Session>) => {

      const newSessions = [];
      const sessionsToUpdate = [];

      for(let session of sessions) {
        const sessionAsAny = (session as any);

        let newSession: any = {
          id: session.airTableId ? session.airTableId : undefined,
          fields: {
            id: session.id ? session.id : await this.getNextSessionId(),
            clientIdRef: session.clientIdRef,
            payment: session.payment,
            date: session.date,
            paymentState: SessionPaymentState[session.paymentState],
            datePayed: session.datePayed ? session.datePayed : null,
            notes: session.notes,
            LinkToQueries: sessionAsAny.LinkToQueries ? sessionAsAny.LinkToQueries : [await this.getQueriesRecordId()]
          }
        }

        if(newSession.id) {
          sessionsToUpdate.push(newSession);
        }
        else {
          newSessions.push(newSession);
        }
      }

      if(sessionsToUpdate.length > 0)
          await this.sessionsTable.update(sessionsToUpdate)

        if(newSessions.length > 0)
          await this.sessionsTable.create(newSessions)

        apiService.cache.clearGroup(cacheGroups[CacheUrlGroupKey.sessionsSaved])
      }
    },{ url: 'clients', type: 'post',
      action: async (apiService: ApiService, client: Client) => {
        const clientAsAny = (client as any);

        let newClient: any = {
          id: client.airTableId ? client.airTableId : undefined,
          fields: {
            id: client.id !== undefined ? client.id : await this.getNextClientId(),
            name: client.name,
            phoneNumber: client.phoneNumber,
            basePayment: client.basePayment,
            isActive: true,
            LinkToQueries: clientAsAny.LinkToQueries ? clientAsAny.LinkToQueries : [await this.getQueriesRecordId()]
          }
        }

        if(client.airTableId) {
          await this.clientsTable.update([newClient])
        }
        else {
          await this.clientsTable.create([newClient])
        }
      }
    }, { url: 'sessions', type: 'delete',
      action: async (apiService: ApiService, id: string) => {
        await this.sessionsTable.destroy(id);
      }
    }, { url: 'count', type: 'get',
      action: async (apiService: ApiService, entityName: string) => {
        const fieldName = `${entityName}-count`

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: [fieldName]
        }).firstPage();

        let result = this.getViewObject(selectResult);

        return result[0][fieldName];
      }
    })
  }
}
