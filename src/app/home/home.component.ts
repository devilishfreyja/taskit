import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    user = {};
    isAuthenticated = false;

    constructor(private auth: AuthService) { }

    ngOnInit() {
        if (this.auth.isLoggedIn()) {
            // Récupère les informations de l'utilisateur enregistrées en session
            // Si le token est valide il sauvegarde les données de l'utilisateur
            // Sinon il renvoie une erreur
            this.auth.getUserInfos().subscribe(
                data => this.trueToken(data),
                error => this.falseToken(error)
            );
        }
    }

    trueToken(data) {
        this.user = data.data;
        this.isAuthenticated = true;
    }

    falseToken(error) {
        console.error(error);
        this.auth.logout();
    }

}
