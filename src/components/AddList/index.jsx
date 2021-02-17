import axios from "axios";
import { useEffect, useState } from "react";

import { List, Badge } from "../../components";

import addSVG from "../../assets/icons/add.svg";
import closeSVG from "../../assets/icons/close.svg";
import "./AddList.scss";
import Loader from "../Loader";

const AddList = ({ colors, onAdd }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedColor, selectColor] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(colors)) {
      selectColor(colors[0].id);
    }
  }, [colors]);

  const addListItem = () => {
    if (!inputValue) {
      alert("Enter your list item");
      return;
    }
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        name: inputValue,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        const color = colors.find((color) => color.id === selectedColor);
        const listObj = { ...data, color, tasks: [] };
        onAdd(listObj);
        onClose();
      })
      .catch(() => {
        alert("Ошибка при добавлении списка");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onClose = () => {
    setShowPopup(false);
    setInputValue("");
    selectColor(colors[0].id);
  };

  return (
    <div className="add-list">
      <List
        onClickList={() => setShowPopup(true)}
        items={[
          {
            iconUrl: addSVG,
            name: "Добавить список",
            className: "list__add-button",
          },
        ]}
      />
      {showPopup && (
        <div className="add-list__popup">
          <img
            src={closeSVG}
            alt="Close button"
            className="add-list__popup_close-btn"
            onClick={onClose}
          />
          <input
            type="text"
            className="field"
            placeholder="Название списка"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="add-list__popup_colors">
            {colors.map((color) => (
              <Badge
                onClick={() => selectColor(color.id)}
                key={color.id}
                color={color.name}
                className={selectedColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addListItem} className="btn">
            {isLoading ? <Loader /> : "Добавить"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddList;
