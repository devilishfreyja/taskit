import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    error = false;
    errorMessage: string;
    disableSubmit = false;

    constructor(private auth: AuthService, private routeur: Router) { }

    ngOnInit() {
        // Si l'utilisateur est déjà log, redirection à l'accueil
        if (this.auth.isLoggedIn()) {
            return this.routeur.navigate(['']);
        }
    }

    login(formData) {
        this.disableSubmit = true;
        // Lien entre le formulaire et le serveur
        this.auth.login(formData).subscribe(
            data => this.loginSuccess(data),
            error => this.loginError(error)
        );
    }

    loginSuccess(data) {
        // Connexion réussie : enregistrement du token dans la session
        localStorage.setItem('user-data', JSON.stringify(data));

        return this.routeur.navigate(['']);
    }

    loginError(error) {
        this.disableSubmit = false;
        this.error = true;
        this.errorMessage = error.error.message;
    }
}
