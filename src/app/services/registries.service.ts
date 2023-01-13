import { Injectable, Pipe } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDoc, collection, docData, Firestore, getDocs, query, where, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistriesService {

  constructor(private firestore: Firestore) { }

  addRegistry(registry: CalendarEvent, collectionName: string) {
    let saveEvent: any = { ...registry}
    saveEvent.start = registry.start.toString()
    saveEvent.end = registry.end?.toString()
    const registryRef = collection(this.firestore, collectionName);
    return addDoc(registryRef, { ...saveEvent });
  }
  async getRegistriesFromDayByPublisher(collectionName: string, id: string, day: number): Promise<Observable<any>> {
    let allRegistries: any = []
    const registryRef = collection(this.firestore, collectionName );
    const getRegistriesByDay = query(registryRef, where("meta.publisher", "==", id),  where("meta.day", "==", day))
    const snapshot = await getDocs(getRegistriesByDay)
    snapshot.forEach((element: any) => {
      allRegistries.push({id: element.id, ...element.data()} as CalendarEvent)
    })
    return allRegistries
  }
  addAndUpdateTime(registryTime: any, collectionName: string){
    if(registryTime.id){
      const registryRef = doc(this.firestore, `${collectionName}/${registryTime.id}`);
      return updateDoc(registryRef, { ...registryTime });
    }else{
      const registryRef = collection(this.firestore, collectionName);
      return addDoc(registryRef, { ...registryTime });
    }
  }
  async getTotals(collectionName: string, id: string): Promise<Observable<any>> {
    let totals: any = []
    const totalsRef = collection(this.firestore, collectionName );
    const getTotals = query(totalsRef, where("email", "==", id))
    const snapshot = await getDocs(getTotals)
    snapshot.forEach((element: any) => {
      totals.push({id: element.id, ...element.data()})
    })
    return totals
  }
}

@Pipe({name: 'round'})
export class RoundPipe {
  transform (input:number) {
    return Math.floor(input);
  }
}