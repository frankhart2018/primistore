import { useState } from "react";
import "./App.css";
import SinglePage from "./components/SinglePage/SinglePage";
import { COLS, ROWS } from "./utils/constants";
import { CHAR2CODE } from "./utils/charset";

const App = () => {
  const [textVal, setTextVal] = useState("");
  const [data, setData] = useState([]);
  const [pagesRequired, setPagesRequired] = useState(0);

  const getPagesRequired = () => {
    let numPages = Math.ceil((textVal.length * 8) / (ROWS * COLS));
    setPagesRequired(numPages);

    let dataString = "";
    textVal.split("").forEach((char) => {
      dataString += CHAR2CODE[char];
    });

    let dataArr = [];
    dataString.split("").forEach((val) => {
      dataArr.push(parseInt(val));
    });

    let totalBits = numPages * ROWS * COLS;
    console.log(totalBits);
    let currentLength = dataArr.length;
    for (let i = 0; i < totalBits - currentLength; i++) {
      dataArr.push(0);
    }

    setData(dataArr);
  };

  return (
    <div className="App">
      <label for="text-val">Enter text:</label>
      <input
        type="text"
        id="text-val"
        onChange={(e) => {
          setTextVal(e.target.value);
        }}
        autoFocus
      />
      <button onClick={() => getPagesRequired()}>Generate</button>
      {data.length > 0 ? (
        <>
          {Array.from({ length: pagesRequired }, (_, index) => (
            <SinglePage
              data={data.slice(index * ROWS * COLS, (index + 1) * ROWS * COLS)}
              key={index}
            />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
