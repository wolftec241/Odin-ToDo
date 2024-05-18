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

    deleteTask(task){
        for(let i=0 ; i < this.allTasks.length; i++){
            if(this.allTasks[i].getTitle() === task.getTitle()){
                this.allTasks.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}

export default Project;