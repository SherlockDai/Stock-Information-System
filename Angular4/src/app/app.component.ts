import { Component, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { StockService } from "./app.stock.service";
import { Option } from "./option";
import { StockDetailComponent } from "./stock-detail.component";
import { isListLikeIterable } from '@angular/core/src/change_detection/change_detection_util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private element: ElementRef, private stockService: StockService){}
  error = false;
  inputValue ="";
  options$: Observable<Option[]>;
  isLeftVisible = false;
  favoriteList= [];
  localFavorite = [];
  toBeDeleted = "";
  onAutoRefresh: boolean;
  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  onSubmit(event){
    this.isLeftVisible = true;
    
  }

  validation(event){
    var input = this.element.nativeElement.querySelector('#input');
    var button = this.element.nativeElement.querySelector('#submit');
    if(this.inputValue.length != 0 && this.inputValue.replace(/\s/g, '').length){
        this.error = false;
        input.classList.remove("has-error");
        button.classList.remove("disabled");
        button.removeAttribute("disabled")
    }
    else{
      this.error = true;
      input.classList.add("has-error");
      button.classList.add("disabled");
      button.disabled = "false";
    }
    this.search(this.inputValue);
  }

  ngOnInit(): void {
    this.localFavorite = JSON.parse(localStorage.getItem("favoriteList"));
    this.options$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
 
      // ignore new term if same as previous term
      distinctUntilChanged(),
 
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.stockService.getOption(term)),
    );
  }

  onBack(isLeft: boolean): void{
    this.isLeftVisible = isLeft;
  }

  returnFavorite(favoriteList): void{
    this.favoriteList = favoriteList;
    localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
  }

  onDelete(symbol: string): void{
    this.toBeDeleted = symbol;
  }

  onClickSymbol(){
    this.isLeftVisible = true;
    
  }

  clear(){
    this.isLeftVisible = false;
    this.inputValue = "";
    this.error = false;
    var input = this.element.nativeElement.querySelector('#input');
    var button = this.element.nativeElement.querySelector('#submit');
    input.classList.remove("has-error");
    button.classList.add("disabled");
  }
}
