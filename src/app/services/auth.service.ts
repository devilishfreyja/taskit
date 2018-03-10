import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    SERVER_URL = 'http://localhost:4201/auth';

    constructor(private http: HttpClient, private routeur: Router) { }

    login(data) {
        // Fait la connexion avec le serveur Node, qui s'occupe de traiter les données
        return this.http.post(`${this.SERVER_URL}/login`, data);
    }

    isLoggedIn() {
        // Force la fonction à retourner un booléen
        return !!localStorage.getItem('user-data');
    }

    getUserInfos() {
        // Récupère les infos du json, et traduit le token
        // NB : coupler avec le serveur et la recherche des infos dans la BDD une fois celle-ci faite
        const userToken = JSON.parse(localStorage.getItem('user-data')).token;
        return this.http.get(`${this.SERVER_URL}/decodetoken/${userToken}`);
    }

    register(data) {
        return this.http.post(`${this.SERVER_URL}/register`, data);
    }

    logout() {
        // Suppression de la session lors de la déconnexion de l'utilisateur
        localStorage.removeItem('user-data');
        return this.routeur.navigate(['login']);
    }
}
