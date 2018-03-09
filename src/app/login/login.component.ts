import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    isAuthenticated = false;
    // Enregistre le token reçu
    userData = null;
    error = false;
    errorMessage: string;

    constructor(private auth: AuthService, private routeur: Router) { }

    ngOnInit() {
        // Si l'utilisateur est déjà log, redirection à l'accueil
        if (this.auth.isLoggedIn()) {
            this.isAuthenticated = true;
            return this.routeur.navigate(['']);
        }
    }

    login(formData) {
        // Lien entre le formulaire et le serveur
        this.auth.login(formData).subscribe(
            data => this.loginSuccess(data),
            error => this.loginError(error)
        );
    }

    loginSuccess(data) {
        // Connexion réussie : enregistrement du token dans la session
        this.isAuthenticated = true;
        this.userData = data;
        localStorage.setItem('user-data', JSON.stringify(data));

        return this.routeur.navigate(['']);
    }

    loginError(error) {
        this.error = true;
        this.errorMessage = error.error.message;
    }

}
