import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Raffle } from '../../models/raffle.model';
import { db } from 'src/app/app.config';
import { doc, getDoc } from 'firebase/firestore';
import { Bank } from '../../models/bank.model';


@Injectable({
  providedIn: 'root'
})
export class RaffleService {
  private readonly API_URL = environment.apiUrl;

  constructor() { }
  async getRaffleById(id: string): Promise<Raffle | null> {
    try {
      const raffleRef = doc(db, 'Raffles', id);
      const raffleDoc = await getDoc(raffleRef);
      
      if (raffleDoc.exists()) {
        const data = raffleDoc.data();
        return {
          id: raffleDoc.id,
          title: data['title'],
          description: data['description'],
          image: data['image'],
          ticketPrice: data['ticketPrice'],
          maxTickets: data['maxTickets'],
          banks: data['banks'] as Bank[],
          termsAndConditions: data['termsAndConditions']
        } as Raffle;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la rifa:', error);
      throw error;
    }
  }
} 