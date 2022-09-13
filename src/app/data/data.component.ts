import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription, zip } from 'rxjs';
import { SaleReport, CodeName, Column } from '../models/model';
import * as moment from 'moment';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, OnDestroy {
  columns: Array<Column> = [];
  _subs: Array<Subscription> = [];
  updateColumnsSubscription: Subscription | undefined;
  saleReports: Array<SaleReport> = [];
  filteredSaleReports: Array<SaleReport> = [];
  agents: Array<CodeName> = [];
  pointsOfSale: Array<string> = [];
  dtss: Array<string> = [];
  filterFields: any = {
    range: undefined,
    pos: undefined,
    agents: undefined,
    dts: undefined,
  }

  public set subs(v: Subscription) {
    this._subs.push(v);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.subs = this.apiService.columns$.subscribe(columns => this.columns = columns);
    this.subs = zip(this.apiService.saleReports$, this.apiService.agents$)
      .subscribe(([reports, agents]) => {
        this.saleReports = reports;
        this.agents = agents;
        this.pointsOfSale = Array.from(new Set(<Array<string>>this.saleReports.map((report: SaleReport) => (<CodeName>report.pointOfSale).name)));
        this.dtss = Array.from(new Set(<Array<string>>this.saleReports.map((report: SaleReport) => (<CodeName>report.dts).name)));
        this.filterReports();
      });
  }

  filterReports(): void {
    const filterByRange = Array.isArray(this.filterFields.range) && !!this.filterFields?.range[0] && !!this.filterFields?.range[1];
    const filterByPointOfSale = !!this.filterFields.pos;
    const filterByAgent = Array.isArray(this.filterFields.agents) && this.filterFields.agents?.length > 0;
    const filterByDts = !!this.filterFields.dts;
    this.filteredSaleReports = [...this.saleReports]
    if (filterByRange) this.filteredSaleReports = [...this.filteredSaleReports].filter((saleReport: SaleReport) => {
      return moment(this.filterFields.range[0]).diff(moment(saleReport.dateAccIn)) < 0 && moment(this.filterFields.range[1]).diff(moment(saleReport.dateAccIn)) > 0;
    })
    if (filterByPointOfSale) this.filteredSaleReports = [...this.filteredSaleReports].filter((saleReport: SaleReport) => saleReport.pointOfSale.name === this.filterFields.pos);
    if (filterByAgent) this.filteredSaleReports = [...this.filteredSaleReports].filter((saleReport: SaleReport) => this.filterFields.agents.map((agent: any) => agent.name).includes(saleReport.agent.name));
    if (filterByDts) this.filteredSaleReports = [...this.filteredSaleReports].filter((saleReport: SaleReport) => saleReport.dts.name === this.filterFields.dts);
  }

  updateColumns(){
    this.apiService.getColumns()
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }
}
