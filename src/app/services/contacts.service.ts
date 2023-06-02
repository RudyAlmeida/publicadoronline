import { Injectable } from '@angular/core';
import { addDoc, collection, docData, Firestore, getDocs, query, where, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private firestore: Firestore) { }
  addMember(Member: any) {
    let saveEvent: any = { ...Member}
    const MemberRef = collection(this.firestore, 'membros');
    return addDoc(MemberRef, { ...saveEvent });
  }
  editMember(registry: any) {
    let saveEvent: any = { ...registry}
    const MemberRef = doc(this.firestore, `membros/${saveEvent.id}`);
    return updateDoc(MemberRef, { ...saveEvent });
  }
  deleteMember(registry: any){
      const MemberRef = doc(this.firestore, `membros/${registry.id}`);
      return deleteDoc(MemberRef);
  }
  async getMembers(id: string): Promise<Observable<any>> {
    let Members: any = []
    const MembersRef = collection(this.firestore, 'membros' );
    const getMembers = query(MembersRef, where("congregationId", "==", id))
    const snapshot = await getDocs(getMembers)
    snapshot.forEach((element: any) => {
      Members.push({id: element.id, ...element.data()})
    })
    return Members
  }
}
