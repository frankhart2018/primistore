import React, { useState } from "react";

const Slider = ({ initialValue, label, count, parentUpdateCallback }) => {
  const [sliderValue, setSliderValue] = useState(initialValue);

  const onUpdateSlider = (e) => {
    const thisVal = e.target.value;
    setSliderValue(thisVal);
    parentUpdateCallback(count, thisVal, "slider");
  };

  return (
    <tr className="border-none">
      <td className="border-none py-2 w-fit">
        <label className="capitalize" htmlFor={`slider-${count}`}>
          {label}
        </label>
      </td>
      <td className="border-none">
        <input
          min="1"
          max="100"
          id={`slider-${count}`}
          type="range"
          value={sliderValue}
          onChange={onUpdateSlider}
          className="h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer w-full"
        ></input>
      </td>
      <td className="border-none text-right">
        <span>{sliderValue}%</span>
      </td>
    </tr>
  );
};

export default Slider;
