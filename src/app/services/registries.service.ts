import { Injectable, Pipe } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDoc, collection, docData, Firestore, getDocs, query, where, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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
  editRegistry(registry: CalendarEvent, collectionName: string) {
    let saveEvent: any = { ...registry}
    saveEvent.start = registry.start.toString()
    saveEvent.end = registry.end?.toString()
    const registryRef = doc(this.firestore, `${collectionName}/${saveEvent.id}`);
    return updateDoc(registryRef, { ...saveEvent });
  }
  deleteRegistry(registry: any, collectionName: string){
      const registryRef = doc(this.firestore, `${collectionName}/${registry.id}`);
      return deleteDoc(registryRef);
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
  async getRegistriesFromPublisher(collectionName: string, id: string): Promise<Observable<any>> {
    let allRegistries: any = []
    const registryRef = collection(this.firestore, collectionName );
    const getRegistriesByDay = query(registryRef, where("meta.publisher", "==", id))
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
  addRevisit(registry: any) {
    const registryRef = collection(this.firestore, "revisits");
    return addDoc(registryRef, { ...registry });
  }
  async getRevisits(id: string): Promise<Observable<any>> {
    let revisits: any = []
    const revisitsRef = collection(this.firestore, 'revisits' );
    const getRevisits = query(revisitsRef, where("publisher", "==", id))
    const snapshot = await getDocs(getRevisits)
    snapshot.forEach((element: any) => {
      revisits.push({id: element.id, ...element.data()})
    })
    return revisits
  }
  editRevist(revisit: any){
      const revistRef = doc(this.firestore, `revisits/${revisit.id}`);
      return updateDoc(revistRef, { ...revisit });
  }
}

@Pipe({name: 'round'})
export class RoundPipe {
  transform (input:number) {
    return Math.floor(input);
  }
}

import { PipeTransform } from '@angular/core';
@Pipe({
  name: 'hours'
})
export class MinutesToHours implements PipeTransform {
  transform(value: number): string {
    let hours = Math.floor(value / 60);
    let minutes = Math.floor(value % 60);
    return hours + ' horas e ' + minutes + ' minutos';
  }
}