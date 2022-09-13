import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  _subs: Array<Subscription> = [];
  basicData: any;
  basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };
  reportPeriod: Array<string> | null | undefined;
  saleReports: Array<string> | undefined;
  filteredSaleReports: Array<string> | undefined;
  reportCountByDays: Map<string, number> = new Map();

  public set subs(v: Subscription) {
    this._subs.push(v);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.subs = this.apiService.saleReports$.subscribe(saleReports => {
      this.saleReports = saleReports.map(report => report.dateAccIn);
      this.reportCountByDays = this.getReportCountByDays(this.saleReports);
      this.basicData = {
        labels: Array.from(this.reportCountByDays.keys()),
        datasets: [{
          label: 'reports',
          backgroundColor: '#42A5F5',
          data: Array.from(this.reportCountByDays.values()),
        }]
      }
    }
    )
  }

  filterSaleReports() {
    if (Array.isArray(this.reportPeriod) && !!this.reportPeriod[0] && !!this.reportPeriod[1]) {
      this.filteredSaleReports = this.saleReports?.filter((saleReport: string) => {
        return moment((this.reportPeriod as Array<string>)[0]).diff(moment(saleReport)) < 0 && moment((this.reportPeriod as Array<string>)[1]).diff(moment(saleReport)) > 0;
      });
      this.reportCountByDays = this.getReportCountByDays(this.filteredSaleReports as Array<string>);
    } else this.reportCountByDays = this.getReportCountByDays(this.saleReports as Array<string>);

    this.basicData = {
      labels: Array.from(this.reportCountByDays.keys()),
      datasets: [{
        label: 'reports',
        backgroundColor: '#42A5F5',
        data: Array.from(this.reportCountByDays.values()),
      }]
    }
  }

  getReportCountByDays(saleReports: Array<string>): Map<string, number> {
    const map: Map<string, number> = new Map();
    saleReports.forEach(report => {
      const reportCount = map.get(report);
      if (!!reportCount) map.set(report, reportCount + 1);
      else map.set(report, 1);
    });
    return map;
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

}
