import React, { useState } from "react";

const Slider = ({ initialValue, label, count, parentUpdateCallback }) => {
  const [sliderValue, setSliderValue] = useState(initialValue);

  const onUpdateSlider = (e) => {
    const thisVal = e.target.value;
    setSliderValue(thisVal);
    parentUpdateCallback(count, thisVal, "slider");
  };

  return (
    // <div className="flex flex-row w-4/5 justify-center items-center space-x-4">
    //   <label for={`slider-${count}`}>{label}</label>
    //   <input
    //     min="1"
    //     max="100"
    //     id={`slider-${count}`}
    //     type="range"
    //     value={sliderValue}
    //     onChange={onUpdateSlider}
    //     class="h-2 bg-gray-950 rounded-lg appearance-none cursor-pointer w-3/5"
    //   ></input>
    //   <span>{sliderValue}%</span>
    // </div>
    <tr className="border-none">
      <td className="border-none py-2 w-fit">
        <label className="capitalize" htmlFor={`slider-${count}`}>{label}</label>
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
