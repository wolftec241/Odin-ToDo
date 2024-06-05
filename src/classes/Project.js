import Task from "./Task.js";

class Project{
    constructor(name){
        this.allTasks = [];
        this.name = name
    }

    getName(){
        return this.name;
    }

    getAllTask(){
        return this.allTasks;
    }

    addNewTask(title, description, dueDate) {
        this.allTasks.push(new Task(title, description, dueDate));
    }

    getAllTasks(){
        return this.allTasks;
    }

    deleteTask(task) {
        const taskIndex = this.allTasks.findIndex(t => t === task);
        if (taskIndex !== -1) {
            this.allTasks.splice(taskIndex, 1);
            return true;
        }
        return false;
    }
}

export default Project;