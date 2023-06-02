import { Injectable, Pipe } from '@angular/core';
import { addDoc, collection, docData, Firestore, getDocs, query, where, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  constructor(private firestore: Firestore) { }

  addMember(Member: any) {
    let saveEvent: any = { ...Member}
    const MemberRef = collection(this.firestore, 'membro-carrinho');
    return addDoc(MemberRef, { ...saveEvent });
  }
  editMember(registry: any) {
    let saveEvent: any = { ...registry}
    const MemberRef = doc(this.firestore, `membro-carrinho/${saveEvent.id}`);
    return updateDoc(MemberRef, { ...saveEvent });
  }
  deleteMember(registry: any){
      const MemberRef = doc(this.firestore, `membro-carrinho/${registry.id}`);
      return deleteDoc(MemberRef);
  }

  async getKartMembers(id: string): Promise<Observable<any>> {
    let members: any = []
    const revisitsRef = collection(this.firestore, 'membro-carrinho' );
    const getRevisits = query(revisitsRef, where("congregationId", "==", id))
    const snapshot = await getDocs(getRevisits)
    snapshot.forEach((element: any) => {
      members.push({id: element.id, ...element.data()})
    })
    return members
  }

  addKart(Member: any) {
    let saveEvent: any = { ...Member}
    const MemberRef = collection(this.firestore, 'carrinho');
    return addDoc(MemberRef, { ...saveEvent });
  }
  editKart(registry: any) {
    let saveEvent: any = { ...registry}
    const MemberRef = doc(this.firestore, `carrinho/${saveEvent.id}`);
    return updateDoc(MemberRef, { ...saveEvent });
  }
  deleteKart(registry: any){
      const MemberRef = doc(this.firestore, `carrinho/${registry.id}`);
      return deleteDoc(MemberRef);
  }

  async getKartsByCongregation(id: string): Promise<Observable<any>> {
    let karts: any = []
    const revisitsRef = collection(this.firestore, 'carrinho' );
    const getRevisits = query(revisitsRef, where("congregationId", "==", id))
    const snapshot = await getDocs(getRevisits)
    snapshot.forEach((element: any) => {
      karts.push({id: element.id, ...element.data()})
    })
    return karts
  }
}
