import classNames from "classnames";
import axios from "axios";

import Badge from "../Badge";

import "./List.scss";
import removeSVG from "../../assets/icons/remove.svg";

const List = ({
  items,
  activeItem,
  isRemovable,
  onRemove,
  onClickList,
  onClickItem,
}) => {
  const confirmRemove = (item) => {
    if (window.confirm("Вы действительно хотите удалить список?")) {
      axios.delete("http://localhost:3001/lists/" + item.id).then(() => {
        onRemove(item.id);
      });
    }
  };

  return (
    <ul className="list" onClick={onClickList}>
      {items.map((item, index) => (
        <li
          key={index}
          className={classNames(item.className, {
            active: item.active
              ? item.active
              : activeItem && activeItem.id === item.id,
          })}
          onClick={onClickItem ? () => onClickItem(item) : null}
        >
          <i>
            {item.iconUrl ? (
              <img src={item.iconUrl} />
            ) : (
              <Badge color={item.color.name} />
            )}
          </i>
          <span>
            {item.name}
            {item.tasks && ` (${item.tasks.length})`}
          </span>
          {isRemovable && (
            <img
              src={removeSVG}
              alt="Remove Item"
              className="list__remove-icon"
              onClick={() => confirmRemove(item)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default List;
