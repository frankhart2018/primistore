import React from "react";

import "./SquareTable.css";
import { COLS } from "../../../utils/constants";

interface SquareTable {
  rows: number;
  cols: number;
  data: string[];
}
const SquareTable = ({ rows, cols, data }: SquareTable) => {
  if (!data || data.length === 0) return null;
  const renderTable = () => {
    let table = [];
    for (let i = 0; i < rows; i++) {
      let tds = [];
      for (let j = 0; j < cols; j++) {
        tds.push(
          <td key={`${i}-${j}`}>
            {data[i * COLS + j] ? (
              <span>•</span>
            ) : (
              <span className="whiteFont">•</span>
            )}
          </td>
        );
      }
      table.push(<tr key={i}>{tds}</tr>);
    }

    return table;
  };

  return (
    <div>
      <table className="w-11/12 mx-auto">
        <tbody>{renderTable()}</tbody>
      </table>
    </div>
  );
};

export default SquareTable;
