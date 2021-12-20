import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {CompagniModel} from "../models/compagni.model";

@Injectable({
  providedIn: 'root'
})
export class CompagniService {

  url = 'http://localhost:8080/compagni/';
  // @ts-ignore
  listCompagnis : CompagniModel[];
  listCompagniSubject = new Subject<CompagniModel[]>();
  emitListCompagniSubject(){
    this.listCompagniSubject.next(this.listCompagnis);
  }

  constructor(private httpClient: HttpClient) { }

  getAllCompagnis() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        // @ts-ignore
        this.listCompagnis = data._embedded.compagni;
        this.emitListCompagniSubject();
      }
    );
  }

  getCompagniById(idCompagni : number) {
    return this.httpClient.get<any>(this.url+idCompagni);
  }


  addCompagni(compagni : CompagniModel) {
    return this.httpClient.post(this.url, compagni);
  }

  updateCompagni(compagni : CompagniModel) {
    return this.httpClient.put(this.url+compagni.id, compagni);
  }

  deleteCompagni(idCompagni : number) {
    return this.httpClient.delete(this.url+idCompagni);
  }

}
