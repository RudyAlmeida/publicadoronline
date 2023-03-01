import { Injectable } from '@angular/core';
import { addDoc, collection, docData, Firestore, getDocs, query, where, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CongregationService {

  constructor(private firestore: Firestore) { }
  addCongregation(congregation: any) {
    let saveEvent: any = { ...congregation}
    const congregationRef = collection(this.firestore, 'congregação');
    return addDoc(congregationRef, { ...saveEvent });
  }
  editCongregation(registry: any) {
    let saveEvent: any = { ...registry}
    const congregationRef = doc(this.firestore, `'congregação'/${saveEvent.id}`);
    return updateDoc(congregationRef, { ...saveEvent });
  }
  deleteCongregation(registry: any){
      const congregationRef = doc(this.firestore, `'congregação'/${registry.id}`);
      return deleteDoc(congregationRef);
  }
  async getCongregations(): Promise<Observable<any>> {
    let congregations: any = []
    const congregationsRef = collection(this.firestore, 'congregação' );
    const getCongregations = query(congregationsRef)
    const snapshot = await getDocs(getCongregations)
    snapshot.forEach((element: any) => {
      congregations.push({id: element.id, ...element.data()})
    })
    return congregations
  }
}
