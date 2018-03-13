import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

    currentTaskPage: string;
    message = false;
    messageContent: string;

    users = <any>[];
    tasks = <any>[];
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

    constructor(
        private auth: AuthService,
        private taskService: TaskService,
        private routeur: Router,
        private adapter: DateAdapter<any>
    ) { }

    ngOnInit() {
        if (!this.auth.isLoggedIn()) {
            return this.routeur.navigate(['']);

        } else {
            this.route();
        }


    }

    route() {
        if (this.routeur.url === '/task') {
            this.currentTaskPage = 'list';

            this.taskService.getAllTasks().subscribe(
                data => this.getAllTasks(data),
                error => this.failAllTasks(error)
            );

        } else if (this.routeur.url === '/task/new') {
            this.currentTaskPage = 'new';
            this.adapter.setLocale('fr');

            this.auth.getAllUsers().subscribe(
                data => this.getAllUsers(data),
                error => this.failAllUsers(error)
            );

        } else if (this.routeur.url === '/task/edit') {
            this.currentTaskPage = 'edit';

        } else if (this.routeur.url === '/task/categories') {
            this.currentTaskPage = 'categories';

        } else {
            console.log('Allô ?');
        }
    }

    // uploadedFile(file: FileList) {
    //     this.uploadedFile = file.item(0);
    //     // console.log(this.uploadedFile);
    // }

    /**
     * Enregistrement des utilisateurs dans uns variable
     */
    getAllUsers(data) {
        this.users = data.data;
    }

    failAllUsers(error) {
        console.log(error.message);
    }

    /**
     * Enregistrement de la liste des tâches existantes
     */
    getAllTasks(data) {
        this.tasks = data.data;
    }

    failAllTasks(error) {
        console.log(error.message);
    }

    /**
     * NOUVELLE TÂCHE
     *
     */
    newTask(formData) {
        if (formData.reminder !== false) {
            formData.reminder = true;
        }

        console.log(formData.start_date_date);
        console.log(formData.start_date_time);

        this.taskService.newTask(formData).subscribe(
            data => this.newTaskSuccess(data),
            error => this.newTaskFail()
        );
    }

    newTaskSuccess(data) {
        this.message = true;
        this.messageContent = data.message;
    }

    newTaskFail() {
        this.message = true;
        this.messageContent = 'Une erreur s\'est produite. Veuillez vérifier les champrs remplis.';
    }

}
