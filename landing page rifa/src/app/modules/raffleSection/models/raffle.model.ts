import { Bank } from './bank.model';

export interface Raffle {
  id: string;
  title: string;
  description: string;
  image: string;
  ticketPrice: number;
  maxTickets: number;
  banks: Bank[];
  status: 'active' | 'completed' | 'pending';
  endDate: string;
  startDate: string;
  termsAndConditions: string;
} 