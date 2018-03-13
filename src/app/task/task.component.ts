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
    tasks = [
        {
            id: 1,
            name: 'Test 1',
            description: 'Une tâche test',
            start_date: '2018-03-13',
            end_date: '2018-03-13',
            recurrence: 'Quotidien',
            status: 'A faire',
            assigned_to: 'Charles',
            privacy: 'Tout le monde',
            attached_file: '',
            reminder: 0,
            assigned_project: 1
        },
        {
            id: 2,
            name: 'Test 2',
            description: 'Une tâche test',
            start_date: '2018-03-13',
            end_date: '2018-03-13',
            recurrence: 'Quotidien',
            status: 'A faire',
            assigned_to: 'Charles',
            privacy: 'Tout le monde',
            attached_file: '',
            reminder: 0,
            assigned_project: 1
        },
        {
            id: 3,
            name: 'Test 3',
            description: 'Une tâche test',
            start_date: '2018-03-13',
            end_date: '2018-03-13',
            recurrence: 'Quotidien',
            status: 'A faire',
            assigned_to: 'Charles',
            privacy: 'Tout le monde',
            attached_file: '',
            reminder: 0,
            assigned_project: null
        },
        {
            id: 4,
            name: 'Test 4',
            description: 'Une tâche test',
            start_date: '2018-03-13',
            end_date: '2018-03-13',
            recurrence: 'Quotidien',
            status: 'A faire',
            assigned_to: 'Charles',
            privacy: 'Tout le monde',
            attached_file: '',
            reminder: 0,
            assigned_project: 2
        }
    ];
    projects = [
        {
            id: 1,
            name: 'Projet 1'
        },
        {
            id: 2,
            name: 'Projet 2'
        }
    ];

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
