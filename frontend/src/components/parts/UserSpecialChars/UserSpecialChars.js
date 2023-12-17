import React, { useState } from "react";

const UserSpecialChars = ({
  initialValue,
  label,
  count,
  parentUpdateCallback,
}) => {
  const [checkboxValue, setCheckboxValue] = useState(initialValue);

  const updateCheckboxValue = (e) => {
    setCheckboxValue(!checkboxValue);
    parentUpdateCallback(count, !checkboxValue, "checkbox");
  };

  const specialChars = [
    "@",
    "#",
    "*",
    "(",
    ")",
    "+",
    "=",
    "{",
    "}",
    "/",
    "?",
    "~",
    ";",
    ",",
    ".",
    "-",
    "_",
  ];

  return (
    <div className="flex flex-col w-1/2 justify-between items-center mb-4">
      <div className="flex flex-row w-full justify-between items-center mb-4">
        <label
          htmlFor={`checkbox-${count}`}
          className="text-md text-gray-900 capitalize"
        >
          {label}
        </label>
        <input
          type="checkbox"
          onChange={updateCheckboxValue}
          checked={checkboxValue}
          className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ms-2"
        />
      </div>
      {checkboxValue && (
        <div className="flex flex-col">
          <div className="flex flex-row flex-wrap items-center border border-red-900 p-4 mb-4">
            {specialChars.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="l:basis-1/6 xl:basis-1/6 2xl:basis-1/12 space-x-1 flex items-center me-3 last:me-0"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ms-2"
                  />
                  <label htmlFor="">{item}</label>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row w-full justify-between items-center mb-4">
          <label className="capitalize" htmlFor="include-special-chars">
            Enter the special characters to include
          </label>
          <input
            type="text"
            id="include-special-chars"
            className="bg-transparent border border-gray-950 text-gray-900 text-sm rounded-lg w-4/5 p-2.5"
          />
        </div>
        </div>
      )}
    </div>
  );
};

export default UserSpecialChars;
