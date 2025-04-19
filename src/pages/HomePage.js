import { useEffect, useState } from 'react';
import { Check, Trash, Edit, Plus, X, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTasks, setError } from '../redux/slices/taskSlice';
import { addTask, deletetask, fetchTasks, updateTask } from "../services/taskService";
import toast from 'react-hot-toast';
import Spinner from '../components/spinner';

export default function HomePage() {
  const { tasks, loading } = useSelector((state) => state.task);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTasks = async () => {
      dispatch(setLoading());
      try {
        const tasksData = await fetchTasks();
        dispatch(setTasks(tasksData));
      } catch (err) {
        dispatch(setError(err));
      }
    };

    loadTasks();
  }, [dispatch]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const taskData = {
      title: newTask
      // isDone
    };

    try {
      const createdTask = await addTask(taskData);
      dispatch(setTasks([...tasks, createdTask]));
      setNewTask('');
    } catch (err) {
      toast.error(err?.msg || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await deletetask(id);
      const updatedTasks = tasks.filter((task) => task._id !== id);
      dispatch(setTasks(updatedTasks));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const toggleTaskCompletion = async (id) => {
    const taskToToggle = tasks.find(task => task._id === id);
    if (!taskToToggle) return;

    try {
      const updatedTask = await updateTask(id, {
        title: taskToToggle.title,
        isDone: !taskToToggle.isDone,
      });

      const updatedTasks = tasks.map(task =>
        task._id === id ? updatedTask : task
      );

      dispatch(setTasks(updatedTasks));
      toast.success("Task updated");
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };


  const startEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTaskText(task.title);
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskText('');
  };

  const saveEdit = async (id) => {
    if (editTaskText.trim() === "") return;

    try {
      const updatedTask = await updateTask(id, { title: editTaskText });

      const updatedTasks = tasks.map((task) =>
        task._id === id ? updatedTask : task
      );

      dispatch(setTasks(updatedTasks));
      setEditTaskId(null);
      setEditTaskText("");
      toast.success("Task updated");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-blue-600">
            <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          </div>

          {/* Add Task Form */}
          <div className="px-6 py-4 border-b">
            <form onSubmit={handleAddTask} className="flex items-center">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md flex items-center transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add
              </button>
            </form>
          </div>

          {/* Task List */}
          {
            loading ?
              <div role="status" className='px-6 py-4 flex justify-center text-center text-gray-500'>
                <Spinner />
              </div>
              :
              <ul className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No tasks yet. Add a task to get started!
                  </li>
                ) : (
                  tasks.map(task => (
                    <li key={task._id} className="px-6 py-4">
                      {editTaskId === task._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editTaskText}
                            onChange={(e) => setEditTaskText(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(task._id)}
                            className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="ml-2 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTaskCompletion(task._id)}
                              className={`flex-shrink-0 h-5 w-5 rounded border ${task.isDone
                                ? 'bg-blue-600 border-blue-600 flex items-center justify-center'
                                : 'border-gray-300 hover:border-blue-500'
                                } transition-colors duration-200`}
                            >
                              {task.isDone && <Check className="h-4 w-4 text-white" />}
                            </button>
                            <span className={`${task.isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => startEditTask(task)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
          }

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
            <span>{tasks.filter(task => task.completed).length} of {tasks.length} tasks completed</span>
            {tasks.length > 0 && (
              <button
                onClick={() => setTasks(tasks.filter(task => !task.completed))}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}