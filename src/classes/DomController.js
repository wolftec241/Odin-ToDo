import { format, isBefore } from "date-fns";
import Task from "./Task.js";
import Project from "./Project.js";

class DomController {
    constructor() {
        this.currentProject = null;
        this.addingBtnRelocation();
        this.initializeEventListeners();
    }

    addingBtnRelocation() {
        window.addEventListener('load', () => this.adjustTaskButtonPosition());
        window.addEventListener('resize', () => this.adjustTaskButtonPosition());
        window.addEventListener('scroll', () => this.adjustTaskButtonPosition());

        const menuBtn = document.getElementById("menuBtn");
        if (menuBtn) {
            menuBtn.addEventListener("click", () => this.toggleSidebar());
        }
    }

    adjustTaskButtonPosition() {
        const taskButton = document.getElementById('task-adding-btn');
        const footer = document.querySelector('footer');
        if (taskButton && footer) {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            taskButton.style.bottom = (footerRect.top < windowHeight) 
                ? `${windowHeight - footerRect.top + 15}px`
                : '15px';
        }
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const taskButton = document.getElementById('task-adding-btn');
            const overlay = document.querySelector('.overlay-new');
            const form = document.querySelector('.create-task-container');
            const closer = document.querySelector('.create-task-container-closer');
            const addingProjectBtn = document.getElementById("add-project-btn");

            if (taskButton && overlay && form && closer) {
                taskButton.addEventListener('click', () => {
                    if(this.currentProject){
                        this.openForm(overlay, form)
                    }
                    
                });
                closer.addEventListener('click', () => this.closeForm(overlay, form));
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.addNewTask();
                    this.closeForm(overlay, form);
                });
            }

            if (addingProjectBtn) {
                addingProjectBtn.addEventListener('click', () => this.addingNewProject());
            }
        });
    }

    openForm(overlay, form) {
        overlay.classList.remove("overlay-new-invisible");
        form.classList.add("create-task-container-open");
    }

    closeForm(overlay, form) {
        overlay.classList.add("overlay-new-invisible");
        form.classList.remove("create-task-container-open");
        form.reset();
    }

    addNewTask() {
        const titleInput = document.getElementById('create-task-title');
        const description = document.getElementById('create-task-description');
        const dueDate = document.getElementById('create-task-date-input');

        if (!this.currentProject) {
            console.error('No current project set');
            return;
        }

        const task = new Task(titleInput.value, description.value, dueDate.value);
        this.currentProject.addNewTask(task);
        const tasksContainer = document.getElementById("tasks");
        if (tasksContainer) {
            tasksContainer.appendChild(this.newTaskContainer(task));
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById("navigation-bar");
        if (sidebar) {
            sidebar.classList.toggle("sidebar-hidden");
            sidebar.style.width = sidebar.classList.contains("sidebar-hidden") ? '0' : 'calc(100% - 40px)';
            sidebar.style.padding = sidebar.classList.contains("sidebar-hidden") ? '0' : '20px';
        }
    }

    markOrUnmark(left, right) {
        left.classList.toggle("checked");
        right.classList.toggle("checked");
    }

    changeProject(project) {
        this.currentProject = project;
        const projectTitle = document.getElementById("project-title");
        const tasksContainer = document.getElementById("tasks");

        if (projectTitle) {
            projectTitle.textContent = this.currentProject.getName();
        }
        
        this.deleteAllTasksContainers();

        if (tasksContainer) {
            this.currentProject.getAllTasks().forEach(task => {
                tasksContainer.appendChild(this.newTaskContainer(task));
            });
        }
    }

    deleteAllTasksContainers() {
        const tasksContainer = document.getElementById("tasks");
        if (tasksContainer) {
            while (tasksContainer.firstChild) {
                tasksContainer.removeChild(tasksContainer.firstChild);
            }
        }
    }

    deleteCorrectContainer(taskContainer) {
        if (taskContainer && taskContainer.parentElement) {
            taskContainer.parentElement.removeChild(taskContainer);
        }
    }

    isExpose(date) {
        return !(isBefore(date, new Date()));
    }

    newTaskContainer(task) {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add("task-container");

        const leftSide = document.createElement('div');
        leftSide.classList.add("left-side");

        const rightSide = document.createElement('div');
        rightSide.classList.add("right-side");

        // CheckBox
        const checkboxInput = document.createElement('div');
        checkboxInput.classList.add("task-checkbox");
        checkboxInput.addEventListener('click', () => {
            this.markOrUnmark(leftSide, rightSide);
        });
        leftSide.appendChild(checkboxInput);

        // Important Button
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

        // Detail Button
        const detailsBtn = document.createElement("div");
        detailsBtn.textContent = "Details";
        detailsBtn.classList.add("task-details");
        detailsBtn.addEventListener("click", () => {
            console.log("Details button clicked");
        });
        rightSide.appendChild(detailsBtn);

        // Due Date
        const date = document.createElement("span");
        date.textContent = this.isExpose(task.getDueDate()) ? "Expired" : format(task.getDueDate(), 'dd/MM/yyyy');
        date.classList.add('task-date');
        rightSide.appendChild(date);

        // Edit Button
        const editBtn = document.createElement("div");
        editBtn.classList.add('task-editBtn');
        editBtn.addEventListener("click", () => {
            console.log("Edit button clicked");
        });
        rightSide.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add('task-deleteBtn');
        deleteBtn.addEventListener("click", () => {
            console.log("Delete button clicked");
            this.deleteCorrectContainer(taskContainer);
            this.currentProject.deleteTask(task);
        });
        rightSide.appendChild(deleteBtn);

        taskContainer.appendChild(rightSide);

        return taskContainer;
    }

    addingNewProject() {
        const projects = document.getElementById('projects');
        const projectContainer = document.createElement('form');
        projectContainer.classList.add('creating-project');

        const title = document.createElement('input');
        const buttons = document.createElement('div');
        const addBtn = document.createElement('input');
        const cancelBtn = document.createElement('div');

        title.classList.add('new-project-title');
        title.maxLength = 24;
        title.type = "text";
        title.placeholder = "Enter Project Name";
        title.required = true;

        buttons.classList.add('creating-project-btns');
        addBtn.classList.add('creating-project-btn');
        addBtn.setAttribute("id", "addProjectBtn");
        addBtn.type = "submit";
        addBtn.value = "Add";
        addBtn.readOnly = true;
        cancelBtn.classList.add('creating-project-btn');
        cancelBtn.textContent = "Cancel";
        cancelBtn.readOnly = true;

        buttons.appendChild(addBtn);
        buttons.appendChild(cancelBtn);
        projectContainer.appendChild(title);
        projectContainer.appendChild(buttons);

        if (projects) {
            projects.appendChild(projectContainer);
        }

        projectContainer.addEventListener("submit", (event) => {
            event.preventDefault();
            this.createProjectContainer(new Project(title.value));
            this.deleteCorrectContainer(projectContainer);
        });

        cancelBtn.addEventListener('click', () => {
            this.deleteCorrectContainer(projectContainer);
        });

        projectContainer.addEventListener('mouseleave', () => {
            this.deleteCorrectContainer(projectContainer);
        });

    }

    createProjectContainer(project) {
        const projects = document.getElementById('projects');
        const projectElement = document.createElement('div');
        const projectTitle = document.createElement('div');
        const projectCloser = document.createElement('div');

        projectElement.classList.add('project');
        projectTitle.textContent = project.getName();
        projectCloser.textContent = '×';
        projectElement.addEventListener('click', () => {
            this.changeProject(project);
        });
        projectElement.appendChild(projectTitle);
        projectElement.appendChild(projectCloser);
        projects.appendChild(projectElement);
    }
    
}

export default DomController;
