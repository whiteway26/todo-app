import React from "react";
import axios from "axios";

import AddTaskForm from "../Tasks/AddTaskForm";
import "./Tasks.scss";
import editSVG from "../../assets/icons/edit.svg";
import Task from "./Task";

export default function Tasks({
  list,
  onEditTitle,
  onAddTask,
  notEmpty,
  onRemoveTask,
  onEditTask,

  onCompleteTask,
}) {
  const editTitle = () => {
    const newTitle = window.prompt("Введите название списка", list.name);

    if (newTitle) {
      onEditTitle(list.id, newTitle);
      axios
        .patch("http://localhost:3001/lists/" + list.id, {
          name: newTitle,
        })
        .catch(() => {
          alert("Не удалось обновить название списка");
        });
    }
  };

  return (
    <div className="tasks">
      <h2 style={{ color: list.color.hex }} className="tasks__title">
        {list.name}
        <img src={editSVG} alt="Edit Title" onClick={editTitle} />
      </h2>
      <div className="tasks__items">
        {!notEmpty && list.tasks && !list.tasks.length && (
          <h2>Задачи отсутствуют</h2>
        )}
        {list.tasks &&
          list.tasks.map((task) => (
            <Task
              key={task.id}
              list={list}
              {...task}
              onRemove={onRemoveTask}
              onEdit={onEditTask}
              onComplete={onCompleteTask}
            />
          ))}
      </div>
      <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
    </div>
  );
}
