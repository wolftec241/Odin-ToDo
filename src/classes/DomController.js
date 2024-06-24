// src/DomController.js

import { format, isAfter, isBefore } from "date-fns";
import Task from "./Task.js";
import Project from "./Project.js";

class DomController {
    constructor() {
        this.currentProject = null;
        this.projects = [];
        this.initializeEventListeners();
        this.loadFromLocalStorage();
    }

    initializeEventListeners() {
        window.addEventListener('load', () => this.adjustTaskButtonPosition());
        window.addEventListener('resize', () => this.adjustTaskButtonPosition());
        window.addEventListener('scroll', () => this.adjustTaskButtonPosition());
    
        const menuBtn = document.getElementById("menuBtn");
        if (menuBtn) {
            menuBtn.addEventListener("click", () => this.toggleSidebar());
        }
    
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeTaskFormListeners();
            this.initializeProjectListeners();
    
            const allTasksLink = document.getElementById('All-tasks');
            const todayTasksLink = document.getElementById('Today-tasks');
            const next7DaysTasksLink = document.getElementById('Next-7-days-tasks');
            const importantTasksLink = document.getElementById('Important-tasks');
    
            if (allTasksLink) {
                allTasksLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.displayAllTasks();
                });
            }
    
            if (todayTasksLink) {
                todayTasksLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.displayTodayTasks();
                });
            }
    
            if (next7DaysTasksLink) {
                next7DaysTasksLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.displayNext7DaysTasks();
                });
            }
    
            if (importantTasksLink) {
                importantTasksLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.displayImportantTasks();
                });
            }
        });
    }
    
    initializeTaskFormListeners() {
        const taskButton = document.getElementById('task-adding-btn');
        const form = document.querySelector('.form-container');
        const closer = document.querySelector('.form-container-closer');
        const containerTitle = document.querySelector('.form-container-title');
        const formSubmitButton = document.getElementById('form-task-submit');
    
        if (taskButton && form && closer && containerTitle && formSubmitButton) {
            taskButton.addEventListener('click', () => {
                if (this.currentProject) {
                    this.prepareFormForNewTask();
                    this.openForm();
                }
            });
    
            closer.addEventListener('click', () => this.closeForm());
    
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (formSubmitButton.value === "Add new task") {
                    this.addNewTask();
                } else {
                    const taskId = formSubmitButton.dataset.taskId;
                    const task = this.currentProject.getTaskById(taskId);
                    this.updateTask(task);
                }
                this.closeForm(form);
            });
        }
    }
    
    
    prepareFormForNewTask() {
        const containerTitle = document.querySelector('.form-container-title');
        const formSubmitButton = document.getElementById('form-task-submit');
    
        containerTitle.textContent = 'Creating Task';
        formSubmitButton.value = 'Add new task';
        formSubmitButton.removeAttribute('data-task-id');
    
        this.clearForm();
    }
    
    prepareFormForEditingTask(task) {
        const containerTitle = document.querySelector('.form-container-title');
        const formSubmitButton = document.getElementById('form-task-submit');
    
        containerTitle.textContent = 'Editing Task';
        formSubmitButton.value = 'Save changes';
        formSubmitButton.dataset.taskId = task.getId();
    
        const title = document.getElementById('task-form-title');
        const description = document.getElementById('task-form-description');
        const date = document.getElementById('task-form-date');
    
        title.textContent = task.getTitle();
        description.textContent = task.getDescription();
        date.textContent = task.getDueDate;
    }
    
    
    clearForm() {
        const title = document.getElementById('task-form-title');
        const description = document.getElementById('task-form-description');
        const date = document.getElementById('task-form-date');
    
        title.value = '';
        description.value = '';
        date.value = '';
    }

    openForm() {
        const overlay = document.querySelector('.overlay-new');
        const form = document.querySelector('.form-container');

        overlay.classList.remove("overlay-new-invisible");
        form.classList.add("form-container-open");
    }

    closeForm() {
        const overlay = document.querySelector('.overlay-new');
        const form = document.querySelector('.form-container');

        overlay.classList.add("overlay-new-invisible");
        form.classList.remove("form-container-open");
        form.reset();
    }
    
    addNewTask() {
        if (!this.currentProject) {
            console.error('No current project set');
            return;
        }
    
        const titleInput = document.getElementById('task-form-title');
        const description = document.getElementById('task-form-description');
        const dueDate = document.getElementById('task-form-date');
        const tasks = document.getElementById('tasks');
    
        const task = new Task(titleInput.value, description.value, new Date(dueDate.value), this.currentProject.getName());
        this.currentProject.addNewTask(task);
        tasks.appendChild(this.newTaskContainer(task));
        this.saveToLocalStorage();
    }
    
    updateTask(task) {
        const titleInput = document.getElementById('task-form-title');
        const description = document.getElementById('task-form-description');
        const dueDate = document.getElementById('task-form-date');
    
        task.setTitle(titleInput.value);
        task.setDescription(description.value);
        task.setDueDate(new Date(dueDate.value));
    
        this.updateTaskContainers();
        this.saveToLocalStorage();
    }
    

    initializeProjectListeners() {
        const addingProjectBtn = document.getElementById("add-project-btn");
        if (addingProjectBtn) {
            addingProjectBtn.addEventListener('click', () => this.addingNewProject());
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

    toggleSidebar() {
        const sidebar = document.getElementById("navigation-bar");
        if (sidebar) {
            sidebar.classList.toggle("sidebar-hidden");
            sidebar.style.width = sidebar.classList.contains("sidebar-hidden") ? '0' : 'calc(100% - 40px)';
            sidebar.style.padding = sidebar.classList.contains("sidebar-hidden") ? '0' : '20px';
        }
    }

    updateTaskContainers() {
        const tasksContainer = document.getElementById("tasks");
        if (tasksContainer) {
            this.deleteAllTasksContainers();
                if(this.currentProject){
                this.currentProject.getAllTasks().forEach(task => {
                    tasksContainer.appendChild(this.newTaskContainer(task));
                });
            }
        }
    }

    changeProject(project) {
        this.currentProject = project;
        const projectTitle = document.getElementById("project-title");
        
        if (projectTitle) {
            projectTitle.textContent = this.currentProject ? this.currentProject.getName() : 'All Tasks';
        }
        
        if (project === null) {
            this.displayAllTasks();
        } else {
            this.updateTaskContainers();
        }
        this.saveToLocalStorage();
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
        const importantBtn = document.createElement('div');
        importantBtn.classList.add('importantBtn');
        importantBtn.addEventListener('click', () => {
            importantBtn.classList.toggle("important");
            task.changeIsImportant();
            this.saveToLocalStorage();
        });
        if (task.getIsImportant()) {
            importantBtn.classList.add("important");
        }
        leftSide.appendChild(importantBtn);
    
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
            this.showTaskDetails(task);
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
            const taskProject = this.findProjectForTask(task);
            if (taskProject) {
                this.changeProject(taskProject);
                this.prepareFormForEditingTask(task);
                this.openForm();
            }
        });
        rightSide.appendChild(editBtn);
    
        // Delete Button
        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add('task-deleteBtn');
        deleteBtn.addEventListener("click", () => {
            const taskProject = this.findProjectForTask(task);
            if (taskProject) {
                taskProject.deleteTask(task);
                this.deleteCorrectContainer(taskContainer);
                if (this.currentProject === null) {
                    this.displayAllTasks();
                } else if (projectTitle.textContent === "Today's Tasks") {
                    this.displayTodayTasks();
                } else if (projectTitle.textContent === "Next 7 Days Tasks") {
                    this.displayNext7DaysTasks();
                } else {
                    this.updateTaskContainers();
                }
            }
        });
        rightSide.appendChild(deleteBtn);
    
        taskContainer.appendChild(rightSide);
    
        return taskContainer;
    }
    

    markOrUnmark(left, right) {
        left.classList.toggle("checked");
        right.classList.toggle("checked");
    }

    deleteCorrectContainer(container) {
        if (container && container.parentElement) {
            container.parentElement.removeChild(container);
            this.saveToLocalStorage();
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

    findProjectForTask(task) {
        return this.projects.find(project => project.getTaskById(task.getId()));
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
        cancelBtn.classList.add('creating-project-btn');
        cancelBtn.textContent = "Cancel";

        buttons.appendChild(addBtn);
        buttons.appendChild(cancelBtn);
        projectContainer.appendChild(title);
        projectContainer.appendChild(buttons);

        if (projects) {
            projects.appendChild(projectContainer);
        }

        projectContainer.addEventListener("submit", (event) => {
            event.preventDefault();
            const newProject = new Project(title.value);
            this.createProjectContainer(newProject);
            this.changeProject(newProject);
            this.deleteCorrectContainer(projectContainer);
        });

        cancelBtn.addEventListener('click', () => {
            this.deleteCorrectContainer(projectContainer);
        });

    }

    createProjectContainer(project) {
        const projects = document.getElementById('projects');
        const projectElement = document.createElement('div');
        const projectTitle = document.createElement('div');
        const projectCloser = document.createElement('div');

        projectElement.classList.add('project');
        projectTitle.classList.add('project-title');
        projectCloser.classList.add('project-closer');

        projectTitle.textContent = project.getName();
        projectCloser.textContent = '×';

        projectTitle.addEventListener('click', () => {
            this.changeProject(project);
        });

        projectCloser.addEventListener('click', () => {
            this.deleteCorrectContainer(projectElement);
            this.projects = this.projects.filter(p => p !== project);
            if (this.currentProject === project) {
                this.changeProject(this.projects.length > 0 ? this.projects[0] : null);
            }
            this.saveToLocalStorage();
        });

        projectElement.appendChild(projectTitle);
        projectElement.appendChild(projectCloser);

        if (projects) {
            projects.appendChild(projectElement);
        }
    
        if (!this.projects.includes(project)) {
            this.projects.push(project);
            this.saveToLocalStorage();
        }
    }

    isExpose(date) {
        return isAfter(new Date(), date);
    }

    showTaskDetails(task) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay-details');
    
        const detailWindow = document.createElement('div');
        detailWindow.classList.add('detail-window');
    
        const title = document.createElement('h2');
        title.textContent = task.getTitle();
    
        const description = document.createElement('p');
        description.textContent = task.getDescription() || 'No description provided';
    
        const dueDate = document.createElement('p');
        dueDate.textContent = `Due Date: ${format(task.getDueDate(), 'dd/MM/yyyy')}`;
    
        const projectName = document.createElement('p');
        const project = this.findProjectForTask(task);
        projectName.textContent = `Project: ${project ? project.getName() : 'Unknown'}`;
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    
        detailWindow.appendChild(title);
        detailWindow.appendChild(description);
        detailWindow.appendChild(dueDate);
        detailWindow.appendChild(projectName);
        detailWindow.appendChild(closeButton);
    
        overlay.appendChild(detailWindow);
        document.body.appendChild(overlay);
    }

    displayAllTasks() {
        const tasksContainer = document.getElementById("tasks");
        const projectTitle = document.getElementById("project-title");
        
        if (tasksContainer && projectTitle) {
            tasksContainer.innerHTML = '';
            projectTitle.textContent = 'All Tasks';
            
            this.projects.forEach(project => {
                project.getAllTasks().forEach(task => {
                    const taskElement = this.newTaskContainer(task);
                    const projectName = document.createElement('span');
                    projectName.textContent = `(${project.getName()})`;
                    projectName.classList.add('task-project-name');
                    taskElement.querySelector('.left-side').appendChild(projectName);
                    tasksContainer.appendChild(taskElement);
                });
            });
        }
    }

    displayTodayTasks() {
        const tasksContainer = document.getElementById("tasks");
        const projectTitle = document.getElementById("project-title");
        
        if (tasksContainer && projectTitle) {
            tasksContainer.innerHTML = '';
            projectTitle.textContent = "Today's Tasks";
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            this.projects.forEach(project => {
                project.getAllTasks().forEach(task => {
                    const taskDate = new Date(task.getDueDate());
                    taskDate.setHours(0, 0, 0, 0);
                    
                    if (taskDate.getTime() === today.getTime()) {
                        const taskElement = this.newTaskContainer(task);
                        const projectName = document.createElement('span');
                        projectName.textContent = `(${project.getName()})`;
                        projectName.classList.add('task-project-name');
                        taskElement.querySelector('.left-side').appendChild(projectName);
                        tasksContainer.appendChild(taskElement);
                    }
                });
            });
        }
    }
    
    displayNext7DaysTasks() {
        const tasksContainer = document.getElementById("tasks");
        const projectTitle = document.getElementById("project-title");
        
        if (tasksContainer && projectTitle) {
            tasksContainer.innerHTML = '';
            projectTitle.textContent = "Next 7 Days Tasks";
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const next7Days = new Date(today);
            next7Days.setDate(today.getDate() + 7);
            
            this.projects.forEach(project => {
                project.getAllTasks().forEach(task => {
                    const taskDate = new Date(task.getDueDate());
                    taskDate.setHours(0, 0, 0, 0);
                    
                    if (taskDate >= today && taskDate <= next7Days) {
                        const taskElement = this.newTaskContainer(task);
                        const projectName = document.createElement('span');
                        projectName.textContent = `(${project.getName()})`;
                        projectName.classList.add('task-project-name');
                        taskElement.querySelector('.left-side').appendChild(projectName);
                        tasksContainer.appendChild(taskElement);
                    }
                });
            });
        }
    }

    displayImportantTasks() {
        const tasksContainer = document.getElementById("tasks");
        const projectTitle = document.getElementById("project-title");
    
        if (tasksContainer && projectTitle) {
            tasksContainer.innerHTML = '';
            projectTitle.textContent = 'Important Tasks';
    
            this.projects.forEach(project => {
                project.getAllTasks().forEach(task => {
                    if (task.getIsImportant()) {
                        const taskElement = this.newTaskContainer(task);
                        const projectName = document.createElement('span');
                        projectName.textContent = `(${project.getName()})`;
                        projectName.classList.add('task-project-name');
                        taskElement.querySelector('.left-side').appendChild(projectName);
                        tasksContainer.appendChild(taskElement);
                    }
                });
            });
        }
    }
    

    saveToLocalStorage() {
        const projectsData = this.projects.map(project => ({
            name: project.getName(),
            tasks: project.getAllTasks().map(task => ({
                id: task.getId(),
                title: task.getTitle(),
                description: task.getDescription(),
                dueDate: task.getDueDate().toISOString(),
                isImportant: task.getIsImportant()
            }))
        }));
        localStorage.setItem('projects', JSON.stringify(projectsData));
        localStorage.setItem('currentProjectName', this.currentProject ? this.currentProject.getName() : '');
    }
    
    
    loadFromLocalStorage() {
        const savedProjects = localStorage.getItem('projects');
        const currentProjectName = localStorage.getItem('currentProjectName');
        if (savedProjects) {
            const projectsData = JSON.parse(savedProjects);
            projectsData.forEach(projectData => {
                const loadedProject = new Project(projectData.name);
                projectData.tasks.forEach(taskData => {
                    const task = new Task(taskData.title, taskData.description, new Date(taskData.dueDate), loadedProject.getName());
                    task.id = taskData.id;
                    if (taskData.isImportant) {
                        task.changeIsImportant();
                    }
                    loadedProject.addNewTask(task);
                });
                this.projects.push(loadedProject);
                this.createProjectContainer(loadedProject);
            });
            if (currentProjectName) {
                const currentProject = this.projects.find(p => p.getName() === currentProjectName);
                if (currentProject) {
                    this.changeProject(currentProject);
                }
            }
        }
    }
    
}

export default DomController;
