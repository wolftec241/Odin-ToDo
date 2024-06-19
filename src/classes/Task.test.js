// src/Task.test.js

import Task from './Task';

describe('Task Class', () => {
    let task;

    beforeEach(() => {
        task = new Task('Test Title', 'Test Description', '2024-06-17');
    });

    test('should create a Task object with correct properties', () => {
        expect(task.getTitle()).toBe('Test Title');
        expect(task.getDescription()).toBe('Test Description');
        expect(task.getDueDate()).toBe('2024-06-17');
        expect(task.getIsImportant()).toBe(false);
        expect(typeof task.getId()).toBe('string');
    });

    test('should set and get title', () => {
        task.setTitle('New Title');
        expect(task.getTitle()).toBe('New Title');
    });

    test('should set and get description', () => {
        task.setDescription('New Description');
        expect(task.getDescription()).toBe('New Description');
    });

    test('should set and get due date', () => {
        task.setDueDate('2024-07-01');
        expect(task.getDueDate()).toBe('2024-07-01');
    });

    test('should change and get isImportant', () => {
        expect(task.getIsImportant()).toBe(false);
        task.changeIsImportant();
        expect(task.getIsImportant()).toBe(true);
        task.changeIsImportant();
        expect(task.getIsImportant()).toBe(false);
    });
});
