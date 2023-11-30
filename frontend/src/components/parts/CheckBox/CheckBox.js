import React, { useState } from "react";

const CheckBox = ({ initialValue, label, count, parentUpdateCallback }) => {
  const [checkboxValue, setCheckboxValue] = useState(initialValue);

  const updateCheckboxValue = (e) => {
    setCheckboxValue(!checkboxValue);
    parentUpdateCallback(count, !checkboxValue, "checkbox");
  };

  return (
    <div>
      <label for={`checkbox-${count}`}>{label}</label>
      <input
        type="checkbox"
        onChange={updateCheckboxValue}
        checked={checkboxValue}
      />
    </div>
  );
};

export default CheckBox;
