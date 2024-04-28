import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decryptPasswordThunk } from "../../../services/password-thunk";
import NavBar from "../../parts/NavBar/NavBar";

const DecryptPassword = () => {
  const { decryptedData, rawData } = useSelector((state) => state.password);
  const [pmsFile, setPmsFile] = useState(null);
  const [stats, setStats] = useState({});

  const pathName = window.location.pathname;
  const passUid = pathName.split("/")[3];

  const dispatch = useDispatch();

  const decryptData = () => {
    dispatch(
      decryptPasswordThunk({
        passUid,
        pmsFile,
      })
    );
  };

  const computeDecryptedDataStats = (decryptedData) => {
    const length = decryptedData.length;
    const stats = {
      Length: length,
      "Has uppercase": decryptedData.match(/[A-Z]/) ? "yes" : "no",
      "Has lowercase": decryptedData.match(/[a-z]/) ? "yes" : "no",
      "% alphabets": (
        Object.values(
          decryptedData
            .trim()
            .toLowerCase()
            .split("")
            .reduce(
              (count, char) =>
                /[a-z]/.test(char)
                  ? { ...count, [char]: (count[char] || 0) + 1 }
                  : count,
              {}
            )
        ).reduce((sum, key) => sum + parseFloat(key), 0) / length
      ).toFixed(2),
      "% numbers": (
        Object.values(
          decryptedData
            .trim()
            .toLowerCase()
            .split("")
            .reduce(
              (count, char) =>
                /[0-9]/.test(char)
                  ? { ...count, [char]: (count[char] || 0) + 1 }
                  : count,
              {}
            )
        ).reduce((sum, key) => sum + parseFloat(key), 0) / length
      ).toFixed(2),
    };

    stats["% specials"] = (
      1 -
      stats["% alphabets"] -
      stats["% numbers"]
    ).toFixed(2);
    return stats;
  };

  useEffect(() => {
    if (decryptedData.length === 0) return;
    setStats(computeDecryptedDataStats(decryptedData));
  }, [decryptedData]);

  return (
    <div>
      <NavBar />
      <div className="flex flex-row w-11/12 mx-auto justify-between items-center mb-8">
        <label
          className="mb-2 text-lg font-medium text-gray-900 capitalize"
          htmlFor="pms-path"
        >
          PMS file:
        </label>
        <input
          type="file"
          className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-3/5 p-2.5"
          id="pms-file"
          onChange={(e) => setPmsFile(e.target.files[0])}
        />
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2 mb-2"
          onClick={() => decryptData()}
        >
          Decrypt
        </button>
      </div>

      <div className="w-11/12 mx-auto">
        <p className="capitalize text-xl font-bold text-center mb-8">
          Decrypted Data
        </p>
        <table className="border-none w-1/8 mx-auto">
          <tbody>
            {decryptedData.length > 0 ? (
              <tr className="border-none">
                <td className="border-none font-semibold text-lg">Data:</td>
                <td className="border-none">{decryptedData}</td>
              </tr>
            ) : (
              <></>
            )}
            {rawData.length > 0 ? (
              <tr className="border-none">
                <td className="border-none font-semibold text-lg">Raw:</td>
                <td className="border-none">{rawData}</td>
              </tr>
            ) : (
              <></>
            )}
            {Object.keys(stats).length > 0 ? (
              <>
                <br />
                <h3 className="font-semibold text-lg">Stats Table:</h3>
                {Object.keys(stats).map((key, idx) => {
                  return (
                    <tr key={idx} className="border-none">
                      <td className="font-semibold text-md">{key}</td>
                      <td>{stats[key]}</td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DecryptPassword;
