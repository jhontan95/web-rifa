import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface RaffleData {
  id: string;
  title: string;
  description: string;
  productImage: string;
  ticketPrice: number;
  maxTickets: number;
  banks: Bank[];
  status: 'active' | 'completed' | 'pending';
  endDate: string;
}

export interface Bank {
  name: string;
  logo: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  currency: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class RaffleService {
  // Rutas de la aplicación
  static readonly LANDING_PAGE_ROUTE = 'landing-page';
  static readonly LANDING_PAGE_ID_ROUTE = 'landing-page/:id';
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRaffleByGuid(guid: string): Observable<RaffleData> {
    return this.http.get<RaffleData>(`${this.API_URL}/${guid}`);
  }
} 