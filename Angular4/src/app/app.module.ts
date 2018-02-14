import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatAutocompleteModule } from '@angular/material';
import { HttpClientModule }    from '@angular/common/http';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

import { AppComponent } from './app.component';
import { StockService } from "./app.stock.service";
import { SlidePanelComponent } from "./slide-panel.component";
import { StockDetailComponent } from "./stock-detail.component";
import { FavoriteComponent } from "./favorite-component";

declare var require: any;
export function highchartsFactory() {
//return require('highcharts');
const hc = require('highcharts');
const dd = require('highcharts/modules/drilldown');
const ex = require('highcharts/modules/exporting');
const st = require('highcharts/modules/stock');

dd(hc);
ex(hc);
st(hc);
return hc;
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    HttpClientModule,
    ChartModule,
  ],
  declarations: [
    AppComponent,
    SlidePanelComponent,
    StockDetailComponent,
    FavoriteComponent,
  ],
  providers: [StockService, { provide: HighchartsStatic, useFactory: highchartsFactory }],
  bootstrap: [AppComponent]
})
export class AppModule { }
