const express = require('express');
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../validators');

const router = express.Router();

// Task routes within a project
router.post('/projects/:projectId/tasks', validateCreateTask, taskController.create);
router.get('/projects/:projectId/tasks', taskController.getByProject);
router.get('/tasks/:taskId', taskController.getById);
router.put('/tasks/:taskId', validateUpdateTask, taskController.update);
router.delete('/tasks/:taskId', taskController.delete);

// My tasks
router.get('/my-tasks', taskController.getMyTasks);

module.exports = router;
