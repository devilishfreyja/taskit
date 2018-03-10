import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    isAuthenticated = false;
    error = false;
    errorMessage: string;

    constructor(private auth: AuthService, private routeur: Router) { }

    ngOnInit() {
        if (this.isAuthenticated || this.auth.isLoggedIn()) {
            this.isAuthenticated = true;
            return this.routeur.navigate(['']);
        }
    }

    register(formData) {
        this.auth.register(formData).subscribe(
            () => this.registerSuccess(),
            error => this.registerError(error)
        );
    }

    registerSuccess() {
        return this.routeur.navigate(['login']);
    }

    registerError(error) {
        this.error = true;
        this.errorMessage = error.error.message;
    }

}
