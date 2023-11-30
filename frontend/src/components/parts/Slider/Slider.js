import React, { useState } from "react";

const Slider = ({ initialValue, label, count, parentUpdateCallback }) => {
  const [sliderValue, setSliderValue] = useState(initialValue);

  const onUpdateSlider = (e) => {
    const thisVal = e.target.value;
    setSliderValue(thisVal);
    parentUpdateCallback(count, thisVal, "slider");
  };

  return (
    <div>
      <label for={`slider-${count}`}>{label}</label>
      <input
        type="range"
        min="1"
        max="100"
        id={`slider-${count}`}
        value={sliderValue}
        onChange={onUpdateSlider}
      />
      <span>{sliderValue}%</span>
    </div>
  );
};

export default Slider;
