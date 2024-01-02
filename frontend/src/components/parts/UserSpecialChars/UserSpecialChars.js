import React, { forwardRef, useImperativeHandle, useState } from "react";
import { DEFAULT_SPECIAL_CHARS } from "../../../utils/constants";

const UserSpecialChars = forwardRef(
  ({ initialValue, label, count, parentUpdateCallback }, ref) => {
    const [optionDisplayCheckBoxValue, setOptionDisplayCheckBoxValue] =
      useState(false);
    const [newSpecialChar, setNewSpecialChar] = useState("");

    const updateCheckboxValue = (_e, char) => {
      setSpecialChars({ ...specialChars, [char]: !specialChars[char] });
      parentUpdateCallback(count, !specialChars[char], "checkbox");
    };

    const [specialChars, setSpecialChars] = useState(
      DEFAULT_SPECIAL_CHARS.reduce((acc, symbol) => {
        acc[symbol] = initialValue;
        return acc;
      }, {})
    );

    const textBoxOnKeyDownHandler = (e) => {
      if (e.key === "Enter") {
        if (newSpecialChar.length !== 1) {
          alert("The length of special character must be 1!");
          return;
        }

        if (Object.keys(specialChars).includes(newSpecialChar)) {
          alert(`${newSpecialChar} is already in the list!`);
          setNewSpecialChar("");
          return;
        }

        setSpecialChars({ ...specialChars, [newSpecialChar]: initialValue });
        setNewSpecialChar("");
      }
    };

    const provideSpecialChars = () => {
      return Object.entries(specialChars)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key);
    };

    useImperativeHandle(ref, () => ({
      provideSpecialChars,
    }));

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
            onChange={() =>
              setOptionDisplayCheckBoxValue(!optionDisplayCheckBoxValue)
            }
            checked={optionDisplayCheckBoxValue}
            className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ms-2"
          />
        </div>
        {optionDisplayCheckBoxValue && (
          <div className="flex flex-col">
            <div className="flex flex-row flex-wrap items-center border border-red-900 p-4 mb-4">
              {Object.keys(specialChars).map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className="l:basis-1/6 xl:basis-1/6 2xl:basis-1/12 space-x-1 flex items-center me-3 last:me-0"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ms-2"
                      checked={specialChars[item]}
                      onChange={(e) => updateCheckboxValue(e, item)}
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
                value={newSpecialChar}
                onKeyDown={textBoxOnKeyDownHandler}
                onChange={(e) => setNewSpecialChar(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default UserSpecialChars;
