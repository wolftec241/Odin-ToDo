class Task{
    constructor(title, description, dueDate){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

    getTitle(){
        return this.title;
    }
    setTitle(title){
        this.title = title;
    }

    getDescription(){
        return this.description;
    }
    setDescription(description){
        this.description = description;
    }

    getDueDate(){
        return this.dueDate;
    }
    setDueDate(title){
        this.dueDate = dueDate;
    }
}



export default Task;