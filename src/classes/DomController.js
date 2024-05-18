class DomController {
    constructor() {
        this.currentProject = null;
    }

    hideNavBar() {
        const menuBtn = document.getElementById("menuBtn");
        const sidebar = document.getElementById("navigation-bar");
        menuBtn.addEventListener("click", function() {
            sidebar.classList.toggle("sidebar-hidden");
            if (sidebar.classList.contains("sidebar-hidden")) {
                sidebar.style.width = '0';
                sidebar.style.padding = '0';
            } else {
                sidebar.style.width = 'calc(100% - 40px)';
                sidebar.style.padding = '20px';
            }
        });
    }

    markOrUnmark(left, right) {
        left.classList.toggle("checked");
        right.classList.toggle("checked");
    }

    addNewTask() {
        console.log("aaa");
    }

    changeProject(project) {
        this.currentProject = project;
        const projectTitle = document.getElementById("project-title");
        const tasksContainer = document.getElementById("tasks");

        projectTitle.textContent = this.currentProject.getName();
        this.deleteAllTasksContainers();

        this.currentProject.getAllTasks().forEach(task => {
            tasksContainer.appendChild(this.newTaskContainer(task));
        });

        
    }

    deleteAllTasksContainers() {
        const tasksContainer = document.getElementById("tasks");
        // Remove all child elements of the tasks container
        while (tasksContainer.firstChild) {
            tasksContainer.removeChild(tasksContainer.firstChild);
        }
    }

    deleteCorrectTaskContainer(taskContainer) {
        if (taskContainer && taskContainer.parentElement) {
            taskContainer.parentElement.removeChild(taskContainer);
        }
        
    }

    newTaskContainer(task) {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add("task-container");

        const leftSide = document.createElement('div');
        leftSide.classList.add("left-side");

        const rightSide = document.createElement('div');
        rightSide.classList.add("right-side");

        // Checkbox
        const checkboxInput = document.createElement('div');
        checkboxInput.classList.add("task-checkbox");
        checkboxInput.addEventListener('click', () => {
            this.markOrUnmark(leftSide, rightSide);
        });
        

        // Append the checkbox to the left side of the task container
        leftSide.appendChild(checkboxInput);

        // Importans
        const importantsBtn = document.createElement('div');
        importantsBtn.classList.add('importantBtn');
        importantsBtn.addEventListener('click', () => {
            importantsBtn.classList.toggle("important");
        });

        leftSide.appendChild(importantsBtn);

        // Title
        const title = document.createElement("p");
        title.textContent = task.getTitle();
        title.classList.add("task-title");
        leftSide.appendChild(title);

        taskContainer.appendChild(leftSide);


        // Details button
        const detailsBtn = document.createElement("div");
        detailsBtn.textContent = "Details";
        detailsBtn.classList.add("task-details");
        // Add event listener to handle details button click
        detailsBtn.addEventListener("click", () => {
            // Show task details or perform other actions
            console.log("Details button clicked");
        });
        rightSide.appendChild(detailsBtn);

        // Date
        const date = document.createElement("span");
        date.textContent = task.getDueDate();
        date.classList.add('task-date');
        rightSide.appendChild(date);

        // Edit button
        const editBtn = document.createElement("div");
        editBtn.classList.add('task-editBtn');
        // Add event listener to handle edit button click
        editBtn.addEventListener("click", () => {
            // Edit task or perform other actions
            console.log("Edit button clicked");
        });
        rightSide.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add('task-deleteBtn');
        // Add event listener to handle delete button click
        deleteBtn.addEventListener("click", () => {
            // Delete task or perform other actions
            console.log("Delete button clicked");
            this.deleteCorrectTaskContainer(taskContainer);
            this.currentProject.deleteTask(task);
        });
        rightSide.appendChild(deleteBtn);

        taskContainer.appendChild(rightSide);

        return taskContainer;
    }
}

export default DomController;
