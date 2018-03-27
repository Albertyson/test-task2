import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class CurrencyService {
	calculatorData: {currency:any;base:any;versus:any;} = {currency:"",base: "", versus: ""};
	chartData: object = {};
	constructor(public http: HttpClient) {}
	getLatest(base,versus): Observable<any>{
		return this.http.get(`http://localhost:3000/latest/${base}-${versus}`);
	}
	getLatestByBase(base): Observable<any>{
		return this.http.get(`http://localhost:3000/latest/${base}`);
	}
	getHistory(base,versus,start,end): Observable<any>{
		return this.http.get(`http://localhost:3000/historical/${base}-${versus}?start=${start}&end=${end}`);
	}
}
