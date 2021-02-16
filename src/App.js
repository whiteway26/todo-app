import axios from "axios";
import { useState, useEffect } from "react";

import { AddList, Tasks, List } from "./components";
import listSVG from "./assets/icons/list.svg";

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [editedTitle, editTitle] = useState(null);

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

  return (
    <div className="todo">
      <section className="todo__sidebar">
        <List
          items={[
            {
              iconUrl: listSVG,
              name: "Все задачи",
              active: true,
            },
          ]}
        />
        {lists ? (
          <List
            items={lists}
            onClickItem={(item) => setActiveItem(item)}
            onRemove={(id) => {
              const newLists = lists.filter((item) => item.id !== id);
              setLists(newLists);
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          "Загрузка..."
        )}
        <AddList colors={colors} onAdd={addListItem} />
      </section>
      <section className="todo__tasks">
        {lists && activeItem && (
          <Tasks
            list={activeItem}
            onEditTitle={editListTitle}
            onAddTask={addTask}
          />
        )}
      </section>
    </div>
  );
}

export default App;
