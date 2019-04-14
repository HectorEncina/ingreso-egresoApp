import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { map } from 'rxjs/operators';

import * as  firebase from 'firebase';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {

        const user: User = {
          uid: resp.user.uid,
          nombre,
          email: resp.user.email
        };

        this.afDB.doc(`${user.uid}/usuario`)
        .set( user )
        .then( () => {
          this.router.navigate(['/']);
        });
      })
      .catch(error => {
        Swal.fire({
          type: 'error',
          title: 'Error al registrarse',
          text: error.message,
        });
      });
  }

  login(email: string, password: string) {

    this.afAuth.auth
        .signInWithEmailAndPassword( email, password )
        .then( resp => {
          this.router.navigate(['/']);
        })
        .catch( error => {

          Swal.fire({
            type: 'error',
            title: 'Error al autenticarse',
            text: error.message,
          });
        });

  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth
    .signOut();
  }

  isAuth() {
    return this.afAuth.authState
        .pipe(
          map( fbUser => {
            if ( fbUser == null) {
              this.router.navigate(['/login']);
            }
            return fbUser != null;
           })
        );
  }
}
