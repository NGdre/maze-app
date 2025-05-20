import React from "react";

const btnClassName = `py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white
           rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700
            focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700
             focus:text-blue-700 inline-flex items-center`;

type btnType = "button" | "submit" | "reset" | undefined;

const defaultBtnType = "button";

// this component exist so you don't have to write className's content in every button
export default function Button({
  type,
  onClick,
  disabled = false,
  children,
}: {
  type?: btnType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type || defaultBtnType}
      onClick={onClick}
      disabled={disabled}
      className={btnClassName}
    >
      {children}
    </button>
  );
}
