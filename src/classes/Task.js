// src/Task.js

class Task {
    constructor(title, description, dueDate) {
        this.id = Task.generateId();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isImportant = false;
    }

    static generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getDueDate() {
        return this.dueDate;
    }

    setTitle(title) {
        this.title = title;
    }

    setDescription(description) {
        this.description = description;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    getIsImportant() {
        return this.isImportant;
    }

    changeIsImportant() {
        this.isImportant = !this.isImportant;
    }
}

export default Task;
