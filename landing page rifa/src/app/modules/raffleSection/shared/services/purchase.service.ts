import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PurchaseFormData {
  fullName: string;
  email: string;
  phone: string;
  ticketQuantity: number;
  totalAmount: number;
  selectedBank: string;
  paymentProof: File;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  // Aquí puedes cambiar la URL por tu endpoint real
  private apiUrl = 'https://api.ejemplo.com/purchases';

  constructor(private http: HttpClient) { }

  submitPurchase(formData: PurchaseFormData): Observable<any> {
    // Crear un FormData para enviar el archivo
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('ticketQuantity', formData.ticketQuantity.toString());
    formDataToSend.append('totalAmount', formData.totalAmount.toString());
    formDataToSend.append('selectedBank', formData.selectedBank);
    formDataToSend.append('paymentProof', formData.paymentProof);

    // Enviar la solicitud POST
    return this.http.post(this.apiUrl, formDataToSend);
  }

  // Método para validar el formulario
  validateForm(formData: PurchaseFormData): string[] {
    const errors: string[] = [];

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!formData.email || !this.isValidEmail(formData.email)) {
      errors.push('El correo electrónico no es válido');
    }

    if (!formData.phone || !this.isValidPhone(formData.phone)) {
      errors.push('El número de teléfono no es válido');
    }

    if (!formData.ticketQuantity || formData.ticketQuantity < 1) {
      errors.push('La cantidad de tickets debe ser mayor a 0');
    }

    if (!formData.paymentProof) {
      errors.push('Debe subir un comprobante de pago');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }
} 