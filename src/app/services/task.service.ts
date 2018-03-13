import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskService {

    SERVER_URL = 'http://localhost:4201/task';

    constructor(private http: HttpClient) { }

    newTask(data) {
        return this.http.post(`${this.SERVER_URL}/new`, data);
    }

    getAllTasks() {
        return this.http.get(`${this.SERVER_URL}/all`);
    }
}
