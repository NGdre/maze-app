import { useState } from "react";
import "./select-buttons.css";
import List from "./List";

/*
  I'm not sure whether I should have used ul or select for semantics. I settled on using ul,
  because it's easier to implement.
*/

const classNames: {
  [className: string]: string;
} = {
  list: "select-btns__list",
  btn: "select-btns__btn",
};

classNames.btnSelected = classNames.btn + " select-btns__btn--selected";

type option = string;

export default function SelectButtons({
  options,
  onSelect,
  defaultOption,
  togglable = false,
}: {
  options: Array<option>;
  onSelect: (selected: option | null) => void;
  defaultOption?: option;
  togglable?: boolean;
}) {
  const [selected, setSelected] = useState<option | null>(
    defaultOption || togglable ? null : options[0]
  );

  return (
    <List
      className={classNames.list}
      items={options}
      renderItem={(option) => {
        return (
          <button
            className={
              selected === option ? classNames.btnSelected : classNames.btn
            }
            onClick={() => {
              let nextState;

              if (togglable) nextState = selected === option ? null : option;
              else nextState = option;

              setSelected(nextState);
              onSelect(nextState);
            }}
          >
            {option}
          </button>
        );
      }}
    />
  );
}
