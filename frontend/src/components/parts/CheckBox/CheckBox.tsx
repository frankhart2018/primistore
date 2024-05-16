import React, { useState } from "react";

interface CheckBoxInterface {
  initialValue: boolean;
  label: string;
  count: number;
  parentUpdateCallback: (a: number, b: boolean, c: string) => {};
}
const CheckBox = ({
  initialValue,
  label,
  count,
  parentUpdateCallback,
}: CheckBoxInterface) => {
  const [checkboxValue, setCheckboxValue] = useState(initialValue);

  const updateCheckboxValue = () => {
    setCheckboxValue(!checkboxValue);
    parentUpdateCallback(count, !checkboxValue, "checkbox");
  };

  return (
    <div className="flex flex-row w-1/2 justify-between items-center mb-4">
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
        className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ms-2 "
      />
    </div>
  );
};

export default CheckBox;
