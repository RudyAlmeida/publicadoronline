import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

@Injectable({
  providedIn: 'root'
})
export class FileService {

  storageRef = firebase.app().storage().ref()

  constructor(private storage: AngularFireStorage) { }

  async uploadFile(pasta: string, nome: string, imgBase64: any){
    try{
      let result = await this.storageRef.child(pasta+'/'+nome).putString(imgBase64, 'data_url')
      return result.ref.getDownloadURL()
    }catch(error){
      console.log(error)
      return null
    }
  }


}
