import { Component, EventEmitter, Input, Output, OnChanges,
    SimpleChanges} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { StockService } from "./app.stock.service";
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

declare let FB: any;
declare var jquery:any;
declare var $ :any;

interface IData {
    [ key: string ]: any;
}

@Component({
    selector: 'app-detail',
    styleUrls: ['stock-detail.component.css'],
    templateUrl: 'stock-detail.component.html',

})

export class StockDetailComponent implements OnChanges{
    options: Object;
    stocks: Object;
    StockOption
    @Output() onBack = new EventEmitter<boolean>();
    @Output() onReturn = new EventEmitter();
    @Input() symbol: string;
    @Input() deleteSymbol: string;
    @Input() onAutoRefresh: boolean;
    @Input() localFavorite;
    ngOnChanges(changes: SimpleChanges){
        if(changes.deleteSymbol != undefined){
            this.delete();
        }
        if(changes.localFavorite && changes.localFavorite.currentValue != null){
            this.favoriteList = this.localFavorite;
            this.onReturn.emit(this.favoriteList);
        }
    }
    interval;
    now = "CurrentStock";
    current = "Price";
    favoriteList = [];
    data: IData;
    chart: Object;
    saved = false;

    ticker: string
    last_price: string;
    change: string;
    change_percent: string;
    img_src: string;
    timestamp: string;
    open: string;
    close: string;
    range: string;
    volume: string;

    error = false;
    errorNews = false;

    up_arrow = "../assets/green_arrow_up.png"
    down_arrow = "../assets/red_arrow_down.png";

    constructor(private stockService: StockService){
        this.data = {
            Symbol: String,
            Price: JSON,
            SMA: JSON,
            EMA: JSON,
            STOCH: JSON,
            RSI: JSON,
            ADX: JSON,
            CCI: JSON,
            BBANDS: JSON,
            MACD: JSON,
            NEWS: JSON
        }
    }

    getDataSpec(symbol: string){
        this.symbol = symbol;
        this.getData();
    }

    getData(){
        this.error = false;
            //update the favorite button
        this.data.Symbol = null;
        this.data.Price = null;
        this.data.SMA = null;
        this.data.EMA = null;
        this.data.STOCH = null;
        this.data.RSI = null;
        this.data.ADX = null;
        this.data.CCI = null;
        this.data.BBANDS = null;
        this.data.MACD = null;
        this.data.NEWS = null;
        this.saved = false;
        for(let stored in this.favoriteList){
            if(this.favoriteList[stored]["Symbol"] == this.symbol){
                this.saved = true;
                this.data['Price'] = this.favoriteList[stored]['Price'];
                this.draw();
            }
        }
        this.data.Symbol = this.symbol;
        if(this.saved == false){
            this.stockService.getData(this.symbol, "Price").subscribe(data => {
                if(!this.error){
                    if(data.hasOwnProperty('Error Message')){
                        this.error = true;
                    }
                    else{
                        this.data['Price'] = data;
                        this.draw();
                    }
                }
            });
        }

        setTimeout(()=>{this.stockService.getData(this.symbol, "SMA").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['SMA'] = data;
                }
            }
        })},200);
        setTimeout(()=>{this.stockService.getData(this.symbol, "EMA").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['EMA'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "STOCH").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['STOCH'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "RSI").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['RSI'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "ADX").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['ADX'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "CCI").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['CCI'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "BBANDS").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['BBANDS'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "MACD").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message')){
                    this.error = true;
                }
                else{
                    this.data['MACD'] = data;
                }
            }
        })},200);;
        setTimeout(()=>{this.stockService.getData(this.symbol, "NEWS").subscribe(data => {
            if(!this.error){
                if(data.hasOwnProperty('Error Message') || !data.hasOwnProperty("rss")){
                    this.errorNews = true;
                }
                else{
                    //fetch the first 5 articles from the JSON data
                    var count = 0;
                    var news_data = [];
                    var items = data["rss"]["channel"][0]["item"];
                    
                    for(let item in items){
                        if(items[item]['link'][0].indexOf("article") !== -1 && count < 5){
                            var news_entry = {
                                title: "",
                                author: "",
                                date: "",
                                link: ""
                            }
                            news_entry.title = items[item]['title'][0];
                            news_entry.author = items[item]['sa:author_name'][0];
                            news_entry.date = items[item][''][0].replace("-0400", "EDT");
                            news_entry.date = news_entry.date.replace("-0500", "EST")
                            news_entry.link = items[item]['link'][0];
                            news_data.push(news_entry);
                            count++;
                        }
                    }
                    this.data['NEWS'] = JSON.parse(JSON.stringify(news_data));
                }
            }
        })},200);
    }

    goBack(){
        this.onBack.emit(false);
        this.now = "CurrentStock";
        this.current = "Price";
    }

    draw(){
        if(this.error){
            return;
        }        
        if(this.current == "Price"){
            if(!(this.isEmpty(this.current))){
                //deal with the raw data
                let count = 0;
                let timeSeries = this.data[this.current]["Time Series (Daily)"];
                let category_array = [];
                let column_data_array = [];
                let area_data_array = [];
                let today;
                let yesterday;
                for(let key in timeSeries){
                    if(count == 131){
                        break;
                    }
                    if(count == 0){
                        today = timeSeries[key];
                    }
                    if(count == 1){
                        yesterday = timeSeries[key];
                    }
                    let day = new Date(key);
                    category_array.push((day.getMonth() + 1) + "/" + (day.getDate()));
                    column_data_array.push(parseFloat(timeSeries[key]['5. volume']));
                    area_data_array.push(parseFloat(timeSeries[key]['4. close']));
                    count++;
                }
                this.ticker = this.data[this.current]["Meta Data"]["2. Symbol"];
                this.last_price = parseFloat(parseFloat(today["4. close"]).toFixed(2)).toLocaleString("en");
                this.open = parseFloat(parseFloat(yesterday["1. open"]).toFixed(2)).toLocaleString("en");
                this.close = parseFloat(parseFloat(yesterday["4. close"]).toFixed(2)).toLocaleString("en");
                this.range = parseFloat(parseFloat(yesterday["3. low"]).toFixed(2)).toLocaleString("en") 
                    + " - " + parseFloat(parseFloat(yesterday["2. high"]).toFixed(2)).toLocaleString("en");
                this.volume = parseFloat(yesterday["5. volume"]).toLocaleString('en');
                var latest_time = new Date(this.data[this.current]['Meta Data']['3. Last Refreshed'].replace(/-/g, '/'));
                this.timestamp = latest_time.getFullYear()+"-"+(latest_time.getMonth() + 1)+'-'+latest_time.getDate()+" "+latest_time.getHours()+":"+latest_time.getMinutes()+":"+latest_time.getSeconds()+" EST";
                this.change = parseFloat((parseFloat(today["4. close"]) - parseFloat(yesterday["4. close"])).toFixed(2)).toLocaleString("en");
                this.change_percent = parseFloat((parseFloat(this.change) * 100 / parseFloat(yesterday["4. close"])).toFixed(2)).toLocaleString("en");
                if(parseFloat(this.change) >= 0){
                    this.img_src = this.up_arrow;
                }
                else{
                    this.img_src = this.down_arrow;
                }
                category_array = category_array.reverse();
                column_data_array = column_data_array.reverse();
                area_data_array = area_data_array.reverse();
                this.options = {
                    chart: {
                        zoomType: 'x',
                        borderWidth: 1,
                        borderColor: "#c8c8c8"
                    },
                    title: {
                        text: this.symbol + " Stock Price and Volume"
                    },
                    subtitle: {
                        text: '<a id="subtitle_a" target="_blank" href="https://www.alphavantage.co/" >Source: Alpha Vantage </a>',
                        useHTML: true
                    },
                    xAxis: [{
                        minTickInterval: 7,
                        categories: category_array
                    }],
                    yAxis: [{ // Primary yAxis
                        floor: 0,
                        minTickInterval: 5,
                        tickAmount: 4,
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#000000'
                            }
                        },
                        title: {
                            text: 'Stock Price',
                            style: {
                                color: '#000000'
                            }
                        }
                    }, { // Secondary yAxis
                        minTickInterval: 20,
                        tickAmount: 4,
                        floor: 0,
                        title: {
                            text: 'Volume',
                            style: {
                                color: '#000000'
                            }
                        },
                        labels: {
                            formatter: function(){
                                return (this.value / 1000000)+" M"
                            },
                            style: {
                                color: '#000000'
                            }
                        },
                        opposite: true
                    }],
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'square',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        backgroundColor: '#ffffff'
                    },
                    series: [{
                        name: "Price",
                        type: 'area',
                        data: area_data_array,
                        color: '#131bf5',
                        fillColor: '#e6e6fd',
                        tooltip: {
                            valueDecimals: 2
                        },
                    }, {
                        name: "Volume",
                        type: 'column',
                        borderWidth: 0,
                        yAxis: 1,
                        data: column_data_array,
                        tooltip: {
                            pointFormatter: function(){
                                return '<span style="color:' + this.series.color + '">' + '●' + '</span>' + " Volume: " + this.y.toLocaleString("en");
                            }
                        },
                        color: '#ed4d44'
                    }]
                };
            }
            else{
                this.stockService.getData(this.symbol, "Price").subscribe(data => {
                    this.data['Price'] = data;
                    if(this.current == 'Price'){
                        this.draw();
                    }
                });
            }
        }
        else{
            if(!(this.isEmpty(this.current))){
                var meta_data = this.data[this.current][Object.keys(this.data[this.current])[0]];
                var entry_data = this.data[this.current][Object.keys(this.data[this.current])[1]];
                var days = Object.keys(entry_data);
                var namesOfLines = Object.keys(entry_data[days[0]]);
                var numOfLines = namesOfLines.length;
                var data = [];
                var category = [];
                for(var i = 0; i < days.length && i <= 130 ; i++){
                    var date = new Date(days[i]);
                    var formated_date = this.addZ(date.getMonth() + 1) + '\/' + this.addZ(date.getDate() + 1);
                    category.push(formated_date);
                }
                category = category.reverse();
                for(var i = 0; i < numOfLines; i++){
                    data[i] = [];
                    for(var j = 0; j < days.length && j <= 130; j++) {
                        data[i].push(parseFloat(entry_data[days[j]][namesOfLines[i]]));
                    }
                    data[i] = data[i].reverse();
                }
                this.options = {
                    title: {
                        text: meta_data["2: Indicator"]
                    },

                    subtitle: {
                        text: '<a id="subtitle_a" target="_blank" href="https://www.alphavantage.co/">Source: Alpha Vantage </a>',
                        useHTML: true

                    },
                    xAxis: [{
                        categories: category,
                        tickInterval: 7,
                        tickAmount: 25
                    }],
                    yAxis: [{ // Primary yAxis
                        tickAmount: 8,
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#000000'
                            }
                        },
                        title: {
                            text: this.current,
                            style: {
                                color: '#000000'
                            }
                        }
                    }],
                    chart: {
                        events: {
                            addSeries: function () {
                                
                            }
                        }
                    },
                    series: [{
                        name: namesOfLines[0],
                        data: data[0],
                        marker: {
                            symbol: "square",
                            radius: 2.5
                        },
                        tooltip: {
                            valueDecimals: 2
                        }
                    }],
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
                for(var i = 1; i < numOfLines; i++){
                    this.options["series"].push({
                        name: namesOfLines[i],
                        data: data[i],
                        marker: {
                            symbol: "square",
                            radius: 2.5
                        },
                        tooltip: {
                            valueDecimals: 2
                        }
                    });
                }
            }
            else{
                this.stockService.getData(this.symbol, this.current).subscribe(data => {
                    var regExp = /\(([^)]+)\)/;
                    var matches = regExp.exec(data["Meta Data"]["2: Indicator"]);
                    this.data[matches[1]] = data;
                    if(this.current == matches[1]){
                       this.draw(); 
                    }
                });
            }
        }
    }
    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }

    isEmpty(tab: string): boolean{
        return this.data[tab] == null || Object.keys(this.data[tab]).length === 0 && this.data[tab].constructor === Object
    }

    drawStock(){
        if(this.error){
            return;
        }
        if(!(this.isEmpty('Price'))){  
            let timeSeries = this.data["Price"]["Time Series (Daily)"];
            let area_data_array = [];
            let today;
            let yesterday;
            for(let key in timeSeries){
                let day = new Date(key);
                let entry = [];
                entry.push(day.getTime());
                entry.push(parseFloat(timeSeries[key]['4. close']));
                area_data_array.push(entry);
            }
            area_data_array = area_data_array.reverse();
            this.stocks = {
                rangeSelector: {
                    buttons: [{
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    },{
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        count: 1,
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                    selected: 0
        
                },
        
                title: {
                    text: this.symbol + ' Stock Price'
                },
        
                series: [{
                    name: this.symbol,
                    data: area_data_array,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            }
        }
    }

    addZ(n){return n<10? '0'+n:''+n;}
    style:string = 'btn';  

    toggleStar(){
        if(this.saved == true){
            //remove the current 
            for(var i = this.favoriteList.length - 1; i >= 0; --i){
                if(this.favoriteList[i]['Symbol'] === this.symbol){
                    this.favoriteList.splice(i, 1);
                }
            }
            this.saved = false;
            this.onReturn.emit(this.favoriteList);
        }
        else{
            var newData = {
                "Price": JSON,
                "Symbol": String
            };
            newData["Price"] = this.data["Price"];
            newData["Symbol"] = this.data["Symbol"];
            this.favoriteList.push(newData);
            this.saved = true;
            this.onReturn.emit(this.favoriteList);
        }
    }
    delete(){
        for(var i = this.favoriteList.length - 1; i >= 0; --i){
            if(this.favoriteList[i]['Symbol'] === this.deleteSymbol){
                this.favoriteList.splice(i, 1);
            }
        }
        this.onReturn.emit(this.favoriteList);
    }
    refresh(){
        //refresh all Price property in favorite list
        for(let entry in this.favoriteList){
            let index = entry;
            this.stockService.getData(this.favoriteList[index]["Symbol"], "Price").subscribe(data => {
                this.favoriteList[index]['Price'] = data;
                this.onReturn.emit(this.favoriteList);
            });
        }
    }
    autoRefresh(event){
        if(event){
            this.interval = setInterval(() => {
                this.refresh();
                  }, 5000);
        }
        else{
            clearInterval(this.interval);
        }
    }

    share(){
        //get the pic first
        var exportUrl = 'http://export.highcharts.com/';
        var optionsStr = JSON.stringify(this.options),
        dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);
        $.ajax({
            type: 'POST',
            data: dataString,
            url: exportUrl,
            success: function (data) {
                 FB.ui({
                     method: 'share',
                     href: exportUrl + data,
                   }, function(response){
                        if(response == undefined){
                            alert("Not Posted")
                        }
                        else{
                            alert("Posted Successfully");
                        }
                   });
            }});
        
    }
}