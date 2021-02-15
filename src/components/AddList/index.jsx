import { useState } from "react";
import Badge from "../Badge";
import List from "../List";

import "./AddList.scss";
import closeSVG from "../../assets/icons/close.svg";

const AddList = ({ colors }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedColor, selectColor] = useState(colors[0].id);

  return (
    <div className="add-list">
      <List
        onClick={() => setShowPopup(true)}
        items={[
          {
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1V15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
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
            onClick={() => setShowPopup(false)}
          />
          <input type="text" className="field" />

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
          <button className="btn">Добавить</button>
        </div>
      )}
    </div>
  );
};

export default AddList;
