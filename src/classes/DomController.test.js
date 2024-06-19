// src/DomController.test.js

import { jest } from '@jest/globals';
import DomController from './DomController';
import Project from './Project';    

describe('DomController Class', () => {
    let domController;
    let project;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="menuBtn"></div>
            <div id="navigation-bar"></div>
            <button id="task-adding-btn"></button>
            <div class="overlay-new overlay-new-invisible"></div>
            <form class="form-container">
                <input id="create-task-title" value="Test Task" />
                <input id="create-task-description" value="Test Description" />
                <input id="create-task-date-input" value="2024-06-17" />
                <button class="form-container-closer"></button>
            </form>
            <div id="tasks"></div>
            <div id="project-title"></div>
            <button id="add-project-btn"></button>
            <footer></footer>
            <div id="projects"></div>
        `;

        domController = new DomController();
        project = new Project('Test Project');
        domController.currentProject = project;
    });

    test('should adjust task button position', () => {
        const taskButton = document.getElementById('task-adding-btn');
        const footer = document.querySelector('footer');
        footer.getBoundingClientRect = jest.fn(() => ({
            top: window.innerHeight - 10,
        }));

        domController.adjustTaskButtonPosition();
        expect(taskButton.style.bottom).toBe('25px');
    });

    test('should toggle sidebar visibility', () => {
        const sidebar = document.getElementById('navigation-bar');
        domController.toggleSidebar();
        expect(sidebar.classList.contains('sidebar-hidden')).toBe(true);
        domController.toggleSidebar();
        expect(sidebar.classList.contains('sidebar-hidden')).toBe(false);
    });

    test('should add a new task', () => {
        domController.addNewTask();
        const tasks = domController.currentProject.getAllTasks();
        expect(tasks.length).toBe(1);
        expect(tasks[0].getTitle()).toBe('Test Task');
    });

    test('should change project', () => {
        const newProject = new Project('New Project');
        domController.changeProject(newProject);
        expect(domController.currentProject).toBe(newProject);
        expect(document.getElementById('project-title').textContent).toBe('New Project');
    });

    test('should open and close form', () => {
        const overlay = document.querySelector('.overlay-new');
        const form = document.querySelector('.form-container');
        domController.openForm(overlay, form);
        expect(overlay.classList.contains('overlay-new-invisible')).toBe(false);
        expect(form.classList.contains('form-container-open')).toBe(true);

        domController.closeForm(overlay, form);
        expect(overlay.classList.contains('overlay-new-invisible')).toBe(true);
        expect(form.classList.contains('form-container-open')).toBe(false);
    });

    test('should create project container', () => {
        domController.createProjectContainer(project);
        const projects = document.getElementById('projects');
        expect(projects.childElementCount).toBe(1);
        expect(projects.firstChild.querySelector('.project-title').textContent).toBe('Test Project');
    });

    // Add more tests as needed
});
