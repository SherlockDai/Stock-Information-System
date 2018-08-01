import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, DoCheck, AfterViewInit, ElementRef } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-favorite',
    styleUrls: ['favorite.component.css'],
    templateUrl: 'favorite.component.html',
})

export class FavoriteComponent implements OnChanges, AfterViewInit{
    constructor(private element: ElementRef){}
    @Output() onBack = new EventEmitter<boolean>();
    @Output() onDelete = new EventEmitter<string>();
    @Output() onRefresh = new EventEmitter();
    @Output() onClickSymbol = new EventEmitter();
    @Output() onClickToggle = new EventEmitter<boolean>();
    @Input() favoriteList;
    ngOnChanges(changes: SimpleChanges) {
            this.calculation();
        }
    toggleValue;
    tableList = [];
    up_arrow = "../assets/green_arrow_up.png"
    down_arrow = "../assets/red_arrow_down.png";

    ngAfterViewInit() {
        $('#my-toggle').bootstrapToggle();
        $('#my-toggle').change((event) => {
          this.toggleValueChanged(event.target.checked);
        });
      }

    goBack(){
        this.onBack.emit(true);
    }
    delete(event){
        this.onDelete.emit(event.target.parentNode.parentNode.parentNode.querySelector(".fav-table-col-1 a").textContent.trim());
    }
    calculation(): void{
        this.tableList = [];
        for(let entry in this.favoriteList){
            let result = {
                Symbol : "",
                Price: "",
                Change: "",
                ChangePercent: "",
                Arrow: "",
                Color: "",
                Volume: ""
            }
            let count = 0;
            let timeSeries = this.favoriteList[entry]["Price"]["Time Series (Daily)"];
            let today;
            let yesterday;
            for(let day in timeSeries){
                if(count > 1){
                    break;
                }
                if(count == 0){
                    today = timeSeries[day];
                }
                if(count == 1){
                    yesterday = timeSeries[day];
                }
                count++;
            }
            result.Symbol = this.favoriteList[entry]["Symbol"];
            result.Price = parseFloat(parseFloat(today["4. close"]).toFixed(2)).toLocaleString("en");
            result.Volume = parseFloat(yesterday["5. volume"]).toLocaleString("en");
            result.Change = (parseFloat(today["4. close"]) - parseFloat(yesterday["4. close"])).toFixed(2);
            result.ChangePercent = (parseFloat(result.Change) * 100 / parseFloat(yesterday["4. close"])).toFixed(2);
            if(parseFloat(result.Change) >= 0){
                result.Arrow = this.up_arrow;
                result.Color = "green";
            }
            else{
                result.Arrow = this.down_arrow;
                result.Color = "red";
            }
            this.tableList.push(result);
        }
        let base = this.element.nativeElement.querySelector("#selector1").value;
        let order = this.element.nativeElement.querySelector("#selector2").value;
        if(base !== "Default"){
            this.sortEntry(base, order);
        }
    }
    refresh(){
        this.onRefresh.emit();
    }
    toggleValueChanged(event){
        //finally
        this.onClickToggle.emit(event);
    }
    clickSymbol(event){
        this.onClickSymbol.emit(event.target.textContent.trim());
    }
    selector1Change(event){
        let order = this.element.nativeElement.querySelector("#selector2").value;
        this.sortEntry(event.target.value, order);
    }
    selector2Change(event){
        this.tableList.reverse();
    }
    sortEntry(baseValue: string, orderValue: string){
        if(baseValue === "Default"){
            this.element.nativeElement.querySelector("#selector2").disabled = "false";
            this.calculation();
        }
        else{
            this.element.nativeElement.querySelector("#selector2").removeAttribute("disabled");
            this.tableList.sort(function(a, b){
                return a[baseValue.trim()] - b[baseValue.trim()];
            })
            if(orderValue === "Descending"){
                this.tableList.reverse();
            }

        }
    }
    buttonValidation(input: boolean){
        var button = this.element.nativeElement.querySelector("#goBack");
        if(!input){
            button.disabled = "false";
            button.classList.add("disabled");
        }
        else{
            button.removeAttribute("disabled");
            button.classList.remove("disabled");
        }
    }
}