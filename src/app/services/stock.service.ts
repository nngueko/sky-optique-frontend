import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {StockModel} from "../models/stockModel";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  url = 'http://localhost:8080/stock/';

  listStocks : StockModel[];
  listStockSubject = new Subject<StockModel[]>();
  emitListStockSubject(){
    this.listStockSubject.next(this.listStocks.slice());
  }
  constructor(private httpClient: HttpClient) { }

  getAllStocks() {
    return this.httpClient.get<any[]>(this.url).subscribe(
      (data: StockModel[]) => {
        this.listStocks = data;
        this.emitListStockSubject();
      }
    );
  }

  getAllStocksByQte(qte : number) {
    return this.httpClient.get<any[]>(this.url+'stockByQte/'+qte).subscribe(
      (data: StockModel[]) => {
        this.listStocks = data;
        this.emitListStockSubject();
      }
    );
  }

  getStockById(idStock : number) {
    return this.httpClient.get<any>(this.url+idStock);
  }

  addStock(stock : StockModel) {
    return this.httpClient.post(this.url, stock);
  }

  updateStock(stock : StockModel, idStock : number) {
    return this.httpClient.put(this.url+idStock, stock);
  }

  deleteStock(idStock : number) {
    return this.httpClient.delete(this.url+idStock);
  }

}
