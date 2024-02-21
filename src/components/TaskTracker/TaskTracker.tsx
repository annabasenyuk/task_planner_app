import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Task } from "../../types/Task";
import { getTodos, addTodos, deleteTodos, updateTodo } from "../../api/tasks";
import { v4 as uuidv4 } from "uuid";
import './TaskTracker.scss';

type Props = {
  selectedDay: Date;
};

export const TaskTracker: React.FC<Props> = ({ selectedDay }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [processingTodoId, setProcessingTodoId] = useState<string | null>(null);

  const formattedDate = format(selectedDay, 'yyyy-MM-dd');

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const allTodos = await getTodos(formattedDate);
      setTasks(allTodos);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [selectedDay]);

  useEffect(() => {
    if (isInputVisible) {
      inputRef.current?.focus();
    }
  }, [isInputVisible]);

  const handleSubmitData = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      console.log('Error: Title Should Not Be Empty');
      return;
    }

    setIsLoading(true);

    try {
      const newTaskData: Task = {
        id: uuidv4(),
        date: formattedDate,
        title: todoTitle.trim(),
        completed: false,
      };

      await addTodos(newTaskData);
      const updatedTasks = await getTodos(formattedDate);
      setTasks(updatedTasks);
      setTodoTitle('');
      setIsInputVisible(false);
    } catch (error) {
      console.log('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEdit = (task: Task) => {
    setIsEditing(true);
    setTodoTitle(task.title);
    setProcessingTodoId(task.id);
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      console.log('Error: Title Should Not Be Empty');
      return;
    }

    const taskToUpdate = tasks.find(task => task.id === processingTodoId);
    if (!taskToUpdate) {
      console.log('Error: Task to update not found');
      return;
    }

    const updatedTask: Task = {
      ...taskToUpdate,
      title: todoTitle.trim(),
    };

    try {
      await updateTodo(updatedTask.id, updatedTask);
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ));
    } catch (error) {
      console.log('Error updating task:', error);
    } finally {
      setIsEditing(false);
      setTodoTitle('');
      setProcessingTodoId(null);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle('');
      setIsInputVisible(false);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      handleEditSubmit(event);
    }
  };

  const handleToggle = async (taskId: string) => {
    setIsLoading(true);

    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) {
        console.log('Error: Task to update not found');
        return;
      }

      const updatedTask: Task = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };

      await updateTodo(taskId, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.log('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaskHandler = async (id: string) => {
    setIsLoading(true);

    try {
      await deleteTodos(id);

      setTasks(tasks => tasks.filter(task => task.id !== id));
    } catch (error) {
      console.log('Error delete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <ol className="tasks">
      {!isInputVisible ? (
        <button
          type="button"
          className="tasks__button"
          onClick={() => setIsInputVisible(true)}
        >
          Add Task
        </button>
      ) : (
        <form
          onSubmit={handleSubmitData}
          onBlur={handleSubmitData}
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
            disabled={isLoading}
            onKeyUp={handleKeyUp}
            ref={inputRef}
            onBlur={() => setIsInputVisible(false)}
            className="tasks__input"
          />
        </form>
      )}

      {isLoading ? (
        <p className="tasks__loader">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="tasks__title bold">No tasks for today.</p>
      ) : (
        <>
          {tasks.map(task => (
            <div className="box" key={task.id}>
              {isEditing && task.id === processingTodoId ? (
                <form
                  onSubmit={handleEditSubmit}
                  onBlur={handleEditSubmit}
                  className="box__form"
                >
                  <input
                    type="text"
                    placeholder="Edit task..."
                    ref={inputRef}
                    value={todoTitle}
                    onChange={(event) => setTodoTitle(event.target.value)}
                    onKeyUp={handleKeyUp}
                    className="box__input"
                  />
                </form>
              ) : (
                <>
                  <div className="box__container">
                    <form className="tasks__form">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="tasks__status"
                        checked={task.completed}
                        onChange={() => handleToggle(task.id)}
                      />
                    </form>

                    <span
                      onDoubleClick={() => handleEdit(task)}
                      style={{
                        textDecoration: task.completed
                          ? 'line-through' : 'none'
                      }}
                      className="tasks__title"
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTaskHandler(task.id)}
                    className="box__button"
                  >
                    x
                  </button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </ol>
  );
};
