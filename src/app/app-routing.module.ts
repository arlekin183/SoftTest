import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data/data.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', component: DataComponent},
  { path: 'reports', component: ReportsComponent},
  { path: '**', component: DataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
