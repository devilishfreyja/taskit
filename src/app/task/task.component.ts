import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

    currentTaskPage: string;
    users = [];
    tasks = [];

    constructor(private auth: AuthService, private routeur: Router, private adapter: DateAdapter<any>) { }

    ngOnInit() {
        if (!this.auth.isLoggedIn()) {
            return this.routeur.navigate(['']);
        }
        else {
            this.route();
        }


    }

    route() {
        if (this.routeur.url === '/task') {
            this.currentTaskPage = 'list';
        }
        else if (this.routeur.url === '/task/new') {
            this.currentTaskPage = 'new';
            this.adapter.setLocale('fr');
        }
        else if (this.routeur.url === '/task/edit') {
            this.currentTaskPage = 'edit';
        }
        else if (this.routeur.url === '/task/categories') {
            this.currentTaskPage = 'categories';
        }
        else {
            console.log('Allô ?');
        }
    }

    uploadedFile(file) {

    }

}
