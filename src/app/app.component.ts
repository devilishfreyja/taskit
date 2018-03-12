import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'TaskIT';
    user = {};
    isAuthenticated = false;
    panelOpenState = false;

    projects = [];
    categories = [];
    selectedProject = 'default';
    selectedCategory = 'default';

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
