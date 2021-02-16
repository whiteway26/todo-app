import React, { useState } from "react";
import axios from "axios";

import addSVG from "../../../assets/icons/add.svg";

export default function AddTaskForm({ list, onAddTask }) {
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
    setInputValue("");
  };

  const addTask = () => {
    const taskObj = {
      listId: list.id,
      text: inputValue,
      completed: false,
    };

    setIsSending(true);
    axios
      .post("http://localhost:3001/tasks", taskObj)
      .then(({ data }) => {
        console.log(data);
        onAddTask(list.id, data);
        toggleFormVisibility();
      })
      .catch(() => {
        alert("Ошибка при добавлении задачи");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="tasks__form">
      {!showForm ? (
        <div className="tasks__form-new" onClick={toggleFormVisibility}>
          <img src={addSVG} alt="Add Icon" />
          <span>Новая задача</span>
        </div>
      ) : (
        <div className="tasks__form-block">
          <input
            type="text"
            value={inputValue}
            className="field"
            placeholder="Текст задачи"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button disabled={isSending} className="btn" onClick={addTask}>
            {isSending ? "Добавление..." : "Добавить задачу"}
          </button>
          <button className="btn btn_grey" onClick={toggleFormVisibility}>
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
