import React, { useState } from "react";
interface NumericInputInterface {
  initialValue: string | readonly string[] | undefined;
  label: string;
  count: number;
  parentUpdateCallback: (a: number, b: boolean, c: string) => {};
}
const NumericInput = ({
  initialValue,
  label,
  count,
  parentUpdateCallback,
}: NumericInputInterface) => {
  const [numericValue, setNumericValue] = useState(initialValue);

  const onUpdateValue = (e: React.ChangeEvent<any>) => {
    const thisVal = e.target.value;
    setNumericValue(thisVal);
    parentUpdateCallback(count, thisVal, "numeric");
  };

  return (
    <tr className="border-none">
      <td className="border-none py-2 w-fit">
        <label className="capitalize" htmlFor={`numeric-${count}`}>
          {label}
        </label>
      </td>
      <td className="border-none">
        <input
          id={`numeric-${count}`}
          type="number"
          value={numericValue}
          onChange={onUpdateValue}
          className="bg-transparent border border-gray-950 text-gray-900 text-sm rounded-lg w-4/5 p-2.5 mb-2"
        ></input>
      </td>
    </tr>
  );
};

export default NumericInput;
