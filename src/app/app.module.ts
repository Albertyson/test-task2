import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { CurrencyService } from './currency.service';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingModule
  ],
  providers: [
    CurrencyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
