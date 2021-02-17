import axios from "axios";
import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { AddList, Tasks, List, Loader } from "./components";
import listSVG from "./assets/icons/list.svg";

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [editedTitle, editTitle] = useState(null);
  let history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      });
    axios.get("http://localhost:3001/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  useEffect(() => {
    const listId = history.location.pathname.split("lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, history.location.pathname]);

  const addListItem = (obj) => {
    const newList = [...lists, obj];
    setLists(newList);
  };

  const editListTitle = (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };

  const addTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });

    setLists(newList);
  };

  const removeTask = (listId, taskId) => {
    if (window.confirm("Вы действительно хотите удалить задачу?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);

      axios.delete("http://localhost:3001/tasks/" + taskId).catch(() => {
        alert("Не удалось удалить задачу");
      });
    }
  };

  const editTask = (listId, taskObj) => {
    const newText = window.prompt("Новый текст задачи", taskObj.text);

    if (!newText) {
      return;
    }

    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id == taskObj.id) {
            task.text = newText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);

    axios
      .patch("http://localhost:3001/tasks/" + taskObj.id, {
        text: newText,
      })
      .catch(() => {
        alert("Не удалось изменить задачу.");
      });
  };

  const completeTask = (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id == taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);

    axios
      .patch("http://localhost:3001/tasks/" + taskId, {
        completed,
      })
      .catch(() => {
        alert("Не удалось обновить задачу.");
      });
  };

  return (
    <div className="todo">
      <section className="todo__sidebar">
        <List
          onClickItem={(list) => history.push(`/`)}
          items={[
            {
              iconUrl: listSVG,
              name: "Все задачи",
              active: history.location.pathname === "/",
            },
          ]}
        />
        {lists ? (
          <List
            items={lists}
            onClickItem={(list) => history.push(`/lists/${list.id}`)}
            onRemove={(id) => {
              const newLists = lists.filter((item) => item.id !== id);
              setLists(newLists);
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          <Loader />
        )}
        <AddList colors={colors} onAdd={addListItem} />
      </section>
      <section className="todo__tasks">
        <Switch>
          <Route exact path="/">
            {lists &&
              lists.map((list) => (
                <Tasks
                  key={list.id}
                  list={list}
                  onEditTitle={editListTitle}
                  onAddTask={addTask}
                  onRemoveTask={removeTask}
                  onEditTask={editTask}
                  onCompleteTask={completeTask}
                  notEmpty
                />
              ))}
          </Route>
          <Route path="/lists/:id">
            {lists && activeItem && (
              <Tasks
                onEditTitle={editListTitle}
                onAddTask={addTask}
                list={activeItem}
                onRemoveTask={removeTask}
                onEditTask={editTask}
                onCompleteTask={completeTask}
              />
            )}
          </Route>
        </Switch>
      </section>
    </div>
  );
}

export default App;
