This is an educational example demonstrating [JavaScript Dynamic Import](JavaScript%20Dynamic%20Import.md).

```js
// taskManager.js

const taskManager = (() => {
  let tasks = [];
  let idCounter = 1;

  const createTask = (description, priority = 'medium') => {
    const task = {
      id: idCounter++,
      description,
      priority,
      completed: false,
      createdAt: new Date()
    };
    tasks.push(task);
    return task;
  };

  const completeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = true;
      return true;
    }
    return false;
  };

  const deleteTask = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  };

  const getTaskById = (id) => {
    return tasks.find(t => t.id === id);
  };

  const getAllTasks = () => {
    return [...tasks];
  };

  const getIncompleteTasks = () => {
    return tasks.filter(t => !t.completed);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(t => t.priority === priority);
  };

  const updateTaskDescription = (id, newDescription) => {
    const task = getTaskById(id);
    if (task) {
      task.description = newDescription;
      return true;
    }
    return false;
  };

  const getSortedTasks = (sortBy = 'createdAt', ascending = true) => {
    return [...tasks].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return ascending ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return ascending ? 1 : -1;
      return 0;
    });
  };

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const incompleteTasks = totalTasks - completedTasks;
    
    return {
      totalTasks,
      completedTasks,
      incompleteTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0
    };
  };

  return {
    createTask,
    completeTask,
    deleteTask,
    getTaskById,
    getAllTasks,
    getIncompleteTasks,
    getTasksByPriority,
    updateTaskDescription,
    getSortedTasks,
    getTaskStats
  };
})();

module.exports = taskManager;

```