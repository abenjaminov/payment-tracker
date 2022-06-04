import * as Airtable from "airtable";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {AirtableBase} from "airtable/lib/airtable_base";
import {FieldSet, Records, Table} from "airtable";
import {Client, GetClientsArgs} from "./client.service";
import {GetSessionArgs, Session, SessionPaymentState} from "./sessions.service";
import {AirTableEntity} from "../models";

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

    identifiers.nextSessionId++;

    await this.updateIdentifiers(identifiers);

    return identifiers.nextSessionId;
  }

  async getNextClientId() {
    let selectResult = await this.identifiersTable.select({view: "Grid view"}).firstPage();
    let identifiers : Identifiers = this.getViewObject(selectResult)[0];

    identifiers.nextClientId++;

    await this.updateIdentifiers(identifiers);

    return identifiers.nextClientId;
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
      action: async (filter: GetClientsArgs) => {
        //this.fixClients()

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
      action : async (filter: GetSessionArgs) => {
        //this.fixSessions()

        let filterFormula = '';

        if(filter) {
          const conditions = [];

          if(filter.filterMonth) {
            conditions.push(`{month} = ${filter.filterMonth + 1}`);
          }

          if(filter.filterClientId) {
            conditions.push(`{clientIdRef}&'' = '${filter.filterClientId}'`);
          }

          if(filter.filterPaymentState) {
            conditions.push(`{paymentState} = '${SessionPaymentState[filter.filterPaymentState]}'`)
          }

          if(filter.filterText) {
            let lowerFilter = filter.filterText.toLowerCase();
            conditions.push(`OR(FIND('${lowerFilter}', LOWER({notes})),FIND('${lowerFilter}', LOWER({clientName}&'')))`)
          }

          filterFormula = `AND(${conditions.join(",")})`;
        }

        const selectResult = await this.sessionsTable.select({
          pageSize: 20,
          offset: 0,
          view: 'Grid view',
          filterByFormula: filterFormula,
          sort: [{ field: 'date', direction: 'desc' }]
        }).firstPage();

        const result = this.getViewObject(selectResult);

        return result;
      }
    },{url: 'monthly-revenue', type: 'get',
      action: async () => {
        // Update sessions

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: ['thisMonthRevenue']
        }).firstPage();

        let result = this.getViewObject(selectResult);

        return result[0]['thisMonthRevenue'];
      }
    },{url: 'debt', type: 'get',
      action: async (month : number) => {
        // Update sessions
        let filterFormula = '';
        if(month) {
          filterFormula = `{paymentMonth} = ${month}`;
        }

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: ['debt'],
          filterByFormula: filterFormula
        }).firstPage();

        let result = this.getViewObject(selectResult);

        return result[0]['debt'];
      }
    },{
      url: 'future-revenue',
      type: 'get',
      action: async () => {
        // Update sessions

        const selectResult = await this.queriesTable.select({
          view: 'Grid view',
          fields: ['futureRevenue']
        }).firstPage();

        let result = this.getViewObject(selectResult);

        return result[0]['futureRevenue'];
      }
    },{ url: 'sessions', type: 'post',
      action: async (session: Session) => {
        if(session.airTableId) {
          await this.sessionsTable.destroy(session.airTableId);
        }

        const sessionsAsAny = (session as any);

        let newSession: any = {
          fields: {
            id: session.id ? session.id : await this.getNextSessionId(),
            clientIdRef: session.clientIdRef,
            payment: session.payment,
            date: session.date,
            paymentState: SessionPaymentState[session.paymentState],
            datePayed: session.datePayed,
            notes: session.notes,
            LinkToQueries: sessionsAsAny.LinkToQueries ? sessionsAsAny.LinkToQueries : [await this.getQueriesRecordId()]
          }
        }

        await this.sessionsTable.create([newSession])


      }
    },{ url: 'clients', type: 'post',
      action: async (client: Client) => {
        if(client.airTableId) {
          await this.clientsTable.destroy(client.airTableId);
        }

        let newClient: any = {
          fields: {
            id: client.id ? client.id : await this.getNextClientId(),
            name: client.name,
            phoneNumber: client.phoneNumber,
            basePayment: client.basePayment,
            isActive: true,
            sessions: '',
            clientSessionIds : []
          }
        }

        await this.clientsTable.create([newClient])


      }
    }, { url: 'sessions', type: 'delete',
      action: async (id: string) => {
        await this.sessionsTable.destroy(id);
      }
    })
  }
}
