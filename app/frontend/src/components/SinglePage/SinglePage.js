import React from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import SquareTable from "../SquareTable/SquareTable";
import { COLS, ROWS } from "../../utils/constants";

const SinglePage = ({ data }) => {
  const targetRef = useRef();

  const exportToJsonFile = (data, uuid) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `output-${uuid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uuid = uuidv4();

  const handleDownloadImage = async (uuid) => {
    const element = targetRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `image-${uuid}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleDownloadImage(uuid)} id="download-image">
          Download Image
        </button>

        <button onClick={() => exportToJsonFile(data, uuid)} id="download-data">
          Download Data
        </button>
      </div>
      <div ref={targetRef}>
        <SquareTable rows={ROWS} cols={COLS} data={data} />
      </div>
    </div>
  );
};

export default SinglePage;
