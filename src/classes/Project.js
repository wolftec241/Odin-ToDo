// src/Project.js

import Task from "./Task.js";

class Project {
    constructor(name) {
        this.allTasks = [];
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getAllTasks() {
        return this.allTasks;
    }

    createNewTask(title, description, dueDate) {
        const newTask = new Task(title, description, dueDate, this.name);
        this.allTasks.push(newTask);
        return newTask;
    }

    addNewTask(task) {
        this.allTasks.push(task);
    }

    getTaskById(taskId) {
        return this.allTasks.find(task => task.getId() === taskId);
    }    

    deleteTask(task) {
        this.allTasks = this.allTasks.filter(t => t.getId() !== task.getId());
    }

    updateTask(updatedTask) {
        const index = this.allTasks.findIndex(task => task.getId() === updatedTask.getId());
        if (index !== -1) {
            this.allTasks[index] = updatedTask;
        }
    }
}

export default Project;
