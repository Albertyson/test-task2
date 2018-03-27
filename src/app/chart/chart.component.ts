import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CurrencyService } from '../currency.service';
import { Chart } from 'chart.js';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
	constructor(private currencyService: CurrencyService,private formBuilder: FormBuilder) { }
	form: FormGroup;
	isLoading: boolean = false;
	isLoadingRates: boolean = false;
	isCalculating: boolean = false;
	chart: object = {};
	rates: any[] = [];
	rangeOptions: any[] = [{
		key: 1,
		name: "1 Week"
	},{
		key: 2,
		name: "1 Month"
	},{
		key: 3,
		name: "3 Months"
	},{
		key: 4,
		name: "Custom Range"
	}];	
	currency: object = {
		label: 'Currency Value',
		placeholder: 'Fill in Currency Value',
		value: ''
	};
	base: object = {
		value: 'USD',		
		label: 'Base'
	};
	versus: object = {
		label: 'Versus',
		value: 'GBP'
	};
	converted: object = {
		label: 'Converted Value',
		value: ''
	};
	convertButton: object = {
		label: 'Convert'
	};
	values: string[] = [];
	options: any[] = [];
	ngOnInit() {
		this.form = this.formBuilder.group({
	    	range: '1',
	    	rangeValue: [new FormControl(new Date()),new FormControl(new Date())]
	    });
	    this.setRange();
	    this.getHistory();
	    this.getRates(true);
	}
	getHistory(){
		var _s = this;
		var startDate = this.form.controls.rangeValue.value[0];
		var endDate = this.form.controls.rangeValue.value[1];
		var formatedStart = moment(startDate).format("MM-DD-YYYY");
		var formatedEnd = moment(endDate).format("MM-DD-YYYY");
		var calculatorData = this.getValues();
		var base = calculatorData.base;
		var versus = calculatorData.versus;
		if(this.isLoading || (this.options.length > 0 && (this.options.indexOf(base) === -1 || this.options.indexOf(versus) === -1))){
			return;
		}
		this.isLoading = true;	
		this.currencyService.getHistory(base,versus,formatedStart,formatedEnd)
  		.subscribe(function(response){
  			_s.isLoading = false;
  			_s.renderChart(response);
  		});
	}
	getRates(fromStart){
		var _s = this;
		if(this.isLoadingRates || (this.options.length > 0 && this.options.indexOf(this.base['value']) === -1)){
			return;
		}
		this.isLoadingRates = true;
		this.currencyService.getLatestByBase(this.base['value']).subscribe(function(response){
			_s.isLoadingRates = false;
			var arr = [];
			var currencyOptions = [];
			_.forEach(response.rates,function(rateValue,rateKey){
				arr.push({name:rateKey,value:rateValue});
				currencyOptions.push(rateKey);
			});
			if(fromStart){
				currencyOptions.push(_s.base['value']);
				_s.options = currencyOptions;
			}
			_s.rates = arr;
		});
	}
	renderChart(response) {
		let temp_max = [];
        let temp_min = [];
        let alldates = [];
        let weatherDates = _.map(response.rates,function(r,rKey){return rKey;});
        if(_.isFunction(this.chart['destroy'])){
        	this.chart['destroy']();
        }
		this.chart = new Chart('canvas', {
			type: 'line',
			data: {
				labels: weatherDates,
				datasets: [
					{
						data: _.map(response.rates,function(r){ return r;}),
						borderColor: '#3cba9f',
						fill: false
					}
				]
			},
			options: {
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						display: true
					}],
					yAxes: [{
						display: true
					}]
				}
			}
		});
	}
	setRange(){
		if(this.isLoading){
			return;
		}
		var startDate = new Date();
		var endDate = new Date();
		switch (this.form.value.range) {
			case '1':{
				startDate.setDate(startDate.getDate() - 7);
				break;
			}
			case '2':{
				startDate.setMonth(startDate.getMonth() - 1);
				break;
			}
			case '3':{
				startDate.setMonth(startDate.getMonth() - 3);
				break;
			}
			case '4':{
				startDate.setMonth(startDate.getMonth() - 12);
				break;
			}
		}
		this.form.patchValue({
			rangeValue: [startDate,endDate]
		});
	}
	convert(){
  		var _s = this;
  		var values = this.getValues();
  		if(this.isCalculating){
  			return;
  		}
  		this.isCalculating = true;
  		this.currencyService.getLatest(values.base,values.versus).subscribe(function(response){
  			_s.isCalculating = false;
  			if(response.rate){
  				_s.converted['value'] = response.rate * _s.currency['value'];
  			}		
  		});
  	};
  	getValues(){
  		return {
  			currency: this.currency['value'],
  			base: this.base['value'],
  			versus: this.versus['value']
  		};
  	};
}
