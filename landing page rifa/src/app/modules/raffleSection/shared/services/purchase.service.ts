import { Injectable } from '@angular/core';
import { db, storage } from 'src/app/app.config';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Purchase, PurchaseStatus } from '../../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly COLLECTION_NAME = 'purchases';
  private readonly STORAGE_PATH = 'payment-proofs';

  constructor() { }

  submitPurchase(formData: Omit<Purchase, 'id' | 'paymentProof' | 'status' | 'createdAt'>): Observable<string> {
    const purchaseData = {
      ...formData,
      createdAt: new Date(),
      status: PurchaseStatus.PENDING,
      paymentProof: '' // Inicialmente vacío, se actualizará después de subir la imagen
    };

    return from(addDoc(collection(db, this.COLLECTION_NAME), purchaseData)).pipe(
      map(docRef => docRef.id),
      catchError(error => {
        console.error('Error al crear la compra:', error);
        return throwError(() => new Error('Error al crear la compra'));
      })
    );
  }

  uploadPaymentProof(purchaseId: string, file: File): Observable<string> {
    const filePath = `${this.STORAGE_PATH}/${purchaseId}/${file.name}`;
    const storageRef = ref(storage, filePath);

    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(snapshot => from(getDownloadURL(snapshot.ref))),
      switchMap(url => {
        const purchaseRef = doc(db, this.COLLECTION_NAME, purchaseId);
        return from(updateDoc(purchaseRef, { paymentProof: url })).pipe(
          map(() => url),
          catchError(error => {
            console.error('Error al actualizar la compra con la URL del archivo:', error);
            return throwError(() => new Error('Error al actualizar la compra con la URL del archivo'));
          })
        );
      }),
      catchError(error => {
        console.error('Error al subir el archivo:', error);
        return throwError(() => new Error('Error al subir el archivo'));
      })
    );
  }

  // Método para validar el formulario
  validateForm(formData: Omit<Purchase, 'id' | 'paymentProof' | 'status' | 'createdAt'>): string[] {
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