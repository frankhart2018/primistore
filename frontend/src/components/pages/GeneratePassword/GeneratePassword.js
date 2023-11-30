import { useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import Slider from "../../parts/Slider/Slider";
import { generateSafePassword } from "../../../utils/password";
import CheckBox from "../../parts/CheckBox/CheckBox";

const GeneratePassword = () => {
  const [sliderValues, setSliderValues] = useState({ 0: 100 });
  const [checkboxValues, setCheckboxValues] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(0);

  const childValueUpdateCallback = (count, value, type) => {
    if (type === "slider") {
      setSliderValues({ ...sliderValues, [count]: value });
    } else if (type === "checkbox") {
      setCheckboxValues({ ...checkboxValues, [count]: value });
    }
  };

  const getObjKeyOrDefault = (obj, key, default_) => {
    return obj.hasOwnProperty(key) ? obj[key] : default_;
  };

  const generatePasswordHandler = () => {
    setGeneratedPassword("");
    let values = Object.values(sliderValues);
    const valuesSum = values.reduce((acc, val) => acc + parseInt(val), 0);

    let errVals = [];
    if (valuesSum !== 100) {
      errVals.push(
        `The percentages must add up to 100%, current sum is ${valuesSum}%`
      );
    }

    if (passwordLength === 0) {
      errVals.push("The length must be greater than 0");
    }

    const uppercase = getObjKeyOrDefault(checkboxValues, "chars-0", true);
    const lowercase = getObjKeyOrDefault(checkboxValues, "chars-1", true);

    if (!uppercase && !lowercase) {
      errVals.push("You must select either uppercase or lowercase or both");
    }

    if (errVals.length > 0) {
      alert(errVals.join("\n"));
    } else {
      const safePassword = generateSafePassword(
        passwordLength,
        values[0],
        values[1],
        values[2],
        uppercase,
        lowercase
      );
      setGeneratedPassword(safePassword);
    }
  };

  return (
    <div>
      <NavBar />
      <br />
      <div>
        <div>
          <label for="password-length">Password length: </label>
          <input
            type="number"
            id="password-length"
            value={passwordLength}
            onChange={(e) => setPasswordLength(parseInt(e.target.value))}
          />
        </div>

        <Slider
          initialValue={100}
          label="Alphabets (uppercase + lowercase) percent: "
          count={0}
          parentUpdateCallback={childValueUpdateCallback}
        />

        <Slider
          initialValue={0}
          label="Number percent: "
          count={1}
          parentUpdateCallback={childValueUpdateCallback}
        />

        <Slider
          initialValue={0}
          label="Special characters percent: "
          count={2}
          parentUpdateCallback={childValueUpdateCallback}
        />

        <CheckBox
          label={"Allow uppercase characters: "}
          count="chars-0"
          initialValue={true}
          parentUpdateCallback={childValueUpdateCallback}
        />

        <CheckBox
          label={"Allow lowercase characters: "}
          count="chars-1"
          initialValue={true}
          parentUpdateCallback={childValueUpdateCallback}
        />

        <div>
          <button onClick={generatePasswordHandler}>Generate Password</button>
        </div>

        {generatedPassword.length > 0 ? (
          <div>
            <strong>The generated password is: </strong>
            {generatedPassword}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default GeneratePassword;
