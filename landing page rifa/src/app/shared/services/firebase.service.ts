import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  // Método para guardar una rifa
  async saveRaffle(raffle: any) {
    try {
      const raffleRef = collection(this.firestore, 'raffles');
      return await addDoc(raffleRef, raffle);
    } catch (error) {
      console.error('Error al guardar la rifa:', error);
      throw error;
    }
  }

  // Método para obtener todas las rifas
  async getRaffles() {
    try {
      const raffleRef = collection(this.firestore, 'raffles');
      const snapshot = await getDocs(raffleRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener las rifas:', error);
      throw error;
    }
  }

  // Método para subir una imagen
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }

  // Método para actualizar una rifa
  async updateRaffle(id: string, data: any) {
    try {
      const raffleRef = doc(this.firestore, 'raffles', id);
      return await updateDoc(raffleRef, data);
    } catch (error) {
      console.error('Error al actualizar la rifa:', error);
      throw error;
    }
  }

  // Método para eliminar una rifa
  async deleteRaffle(id: string) {
    try {
      const raffleRef = doc(this.firestore, 'raffles', id);
      return await deleteDoc(raffleRef);
    } catch (error) {
      console.error('Error al eliminar la rifa:', error);
      throw error;
    }
  }
} 