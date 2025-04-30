export enum PurchaseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Purchase {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    ticketQuantity: number;
    totalAmount: number;
    selectedBank: string;
    paymentProof: string; // URL de la imagen en Firebase Storage
    raffleId: string;
    status: PurchaseStatus;
    createdAt: Date;
  }