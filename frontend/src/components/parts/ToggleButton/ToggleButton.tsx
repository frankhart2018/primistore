import React, { useState } from "react";

interface ToggleButtonInterface {
  leftOption: string;
  rightOption: string;
  parentUpdateCallback: any;
}
const ToggleButton = ({
  leftOption,
  rightOption,
  parentUpdateCallback,
}: ToggleButtonInterface) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    parentUpdateCallback(!isChecked);
  };

  return (
    <>
      <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center me-5">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <span className="label flex items-center text-sm font-medium text-black">
          {leftOption}
        </span>
        <span
          className={`slider mx-1 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
            isChecked ? "bg-[#212b36]" : "bg-[#CCCCCE]"
          }`}
        >
          <span
            className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
              isChecked ? "translate-x-[28px]" : ""
            }`}
          ></span>
        </span>
        <span className="label flex items-center text-sm font-medium text-black">
          {rightOption}
        </span>
      </label>
    </>
  );
};

export default ToggleButton;
