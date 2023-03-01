import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, docData, Firestore, getDocs, query, where, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: SocialAuthService, private router: Router, private auth: AngularFireAuth, private firestore: Firestore) { }

  login() {
    this.authService.authState.subscribe((user: any) => {
      user.showVideo = "true"
      localStorage.setItem('publicador', JSON.stringify(user));
      this.router.navigate(['/relatorio']);
    })
  }
  getUser() {
    let user;
    return user = localStorage.getItem('publicador');
  }
  signOut(): void {
    localStorage.clear()
    this.router.navigate(['/login']);
    this.authService.signOut();
  }
  loginWithEmailAndPassword(email: any, password: any) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(
        async (res: any) => {
          res.user
            .getIdTokenResult()
            .then(async (res: any) => {
              let user: any = []
              const totalsRef = collection(this.firestore, 'super');
              const getTotals = query(totalsRef, where("email", "==", res.claims.email))
              const snapshot = await getDocs(getTotals)
              if (snapshot.size > 0) {
                snapshot.forEach((element: any) => {
                  user.push({ id: element.id, ...element.data() })
                })
                localStorage.setItem('super', JSON.stringify(user));
                this.router.navigate(['/congregacao']);
              }else{
                const totalsRef = collection(this.firestore, 'congregação');
                const getTotals = query(totalsRef, where("email", "==", res.claims.email))
                const snapshot = await getDocs(getTotals)
                if (snapshot.size > 0) {
                  snapshot.forEach((element: any) => {
                    user.push({ id: element.id, ...element.data() })
                  })
                  localStorage.setItem('congregation', JSON.stringify(user));
                  this.router.navigate(['/contatos']);
                } 
              }
            });
        },
        (err: FirebaseError) => this.emitError(err.code)
      )
      .catch((error) => {
        this.emitError(error.message);
      });
  }
  loginSuper() {
    let user;
    return user = (localStorage.getItem('super'));
  }
  loginCongregation() {
    let user;
    return user = (localStorage.getItem('congregation'));
  }

  emitError(code: string) { }

}
