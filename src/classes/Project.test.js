// src/Project.test.js

import Project from './Project';
import Task from './Task';

describe('Project Class', () => {
    let project;

    beforeEach(() => {
        project = new Project('Test Project');
    });

    test('should create a Project object with correct properties', () => {
        expect(project.getName()).toBe('Test Project');
        expect(project.getAllTasks()).toEqual([]);
    });

    test('should create and add a new task', () => {
        const task = project.createNewTask('Test Task', 'Test Description', '2024-06-17');
        expect(project.getAllTasks()).toContain(task);
    });

    test('should add an existing task', () => {
        const task = new Task('Existing Task', 'Existing Description', '2024-06-17');
        project.addNewTask(task);
        expect(project.getAllTasks()).toContain(task);
    });

    test('should delete a task', () => {
        const task = project.createNewTask('Task to Delete', 'Description', '2024-06-17');
        project.deleteTask(task);
        expect(project.getAllTasks()).not.toContain(task);
    });

    test('should update a task', () => {
        const task = project.createNewTask('Task to Update', 'Description', '2024-06-17');
        task.setTitle('Updated Task');
        project.updateTask(task);
        expect(project.getAllTasks().find(t => t.getId() === task.getId()).getTitle()).toBe('Updated Task');
    });
});
