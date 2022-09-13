import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  pages = [
    { name: 'Data', code: '' },
    { name: 'Reports', code: 'reports' }
  ]
  selectedPage: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.receiveAgents();
    this.apiService.receiveSaleReports();
    this.apiService.getColumns();
    this.changePage({value: ''});
  }

  changePage(event: any): void {
    this.router.navigate([event.value]);
  }
}
