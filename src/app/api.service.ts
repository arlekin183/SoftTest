import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { SaleReportsResponse, AgentsResponse, SaleReport, CodeName, Column } from './models/model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = 'http://localhost:3000';
  _subs: Array<Subscription> = [];
  updateColumnsSubscription: Subscription | undefined;
  saleReportsSubject$ = new BehaviorSubject<Array<SaleReport>>([]);
  agentsSubject$ = new BehaviorSubject<Array<CodeName>>([]);
  columnsSubject$ = new BehaviorSubject<Array<any>>([]);
  public saleReports$ = this.saleReportsSubject$.asObservable();
  public agents$ = this.agentsSubject$.asObservable();
  public columns$ = this.columnsSubject$.asObservable();

  public set subs(v: Subscription) {
    this._subs.push(v);
  }

  constructor(private http: HttpClient) { }

  receiveSaleReports(): void {
    this.http.get('/assets/salereports.json').subscribe(saleReportsResponse => {
      this.saleReportsSubject$.next((saleReportsResponse as SaleReportsResponse).items)
    });
  }

  receiveAgents(): void {
    this.http.get('/assets/agents.json').subscribe(agentsResponse => {
      this.agentsSubject$.next((agentsResponse as AgentsResponse).agents);
    });
  }

  getColumns(): void {
    if (this.updateColumnsSubscription) this.updateColumnsSubscription.unsubscribe();
    this.updateColumnsSubscription = this.http.get(this.api).subscribe(columnsResponse => {
      this.columnsSubject$.next(columnsResponse as Array<Column>);
    });
  }
}
