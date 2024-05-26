import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decryptPasswordThunk } from "../../../services/password-thunk";
import NavBar from "../../parts/NavBar/NavBar";

interface PasswordState {
  decryptedData: string;
  rawData: string;
}
interface RootState {
  password: PasswordState;
}

const DecryptPassword = () => {
  const decryptedData: string = useSelector<RootState, string>(
    (state) => state.password.decryptedData,
  );
  const rawData: string = useSelector<RootState, string>(
    (state) => state.password.rawData,
  );

  const [pmsFile, setPmsFile] = useState<File | null>(null);
  const [stats, setStats] = useState<any>({});

  const pathName = window.location.pathname;
  const passUid = pathName.split("/")[3];

  const dispatch = useDispatch<any>();

  const decryptData = () => {
    if (pmsFile != null) {
      dispatch(
        decryptPasswordThunk({
          passUid,
          pmsFile,
        }),
      );
    }
  };

  const computeDecryptedDataStats = (decryptedData: string) => {
    const length = decryptedData.length;

    const stats: object = {
      Length: length,
      "Has uppercase": decryptedData.match(/[A-Z]/) ? "yes" : "no",
      "Has lowercase": decryptedData.match(/[a-z]/) ? "yes" : "no",
      "% alphabets": (
        Object.values(
          decryptedData
            .trim()
            .toLowerCase()
            .split("")
            .reduce<{ [key: string]: number }>(
              (count, char) =>
                /[a-z]/.test(char)
                  ? { ...count, [char]: (count[char] || 0) + 1 }
                  : count,
              {}
            )
        ).reduce((sum: number, key: number) => sum + parseFloat(key.toString()), 0) / length
      ).toFixed(2),
      "% numbers": (
        Object.values(
          decryptedData
            .trim()
            .toLowerCase()
            .split("")
            .reduce<{ [key: string]: number }>(
              (count, char) =>
                /[0-9]/.test(char)
                  ? { ...count, [char]: (count[char] || 0) + 1 }
                  : count,
              {}
            )
        ).reduce((sum: number, key: number) => sum + parseFloat(key.toString()), 0) / length
      ).toFixed(2),
    };

    const updatedStats: { [key: string]: any } = { ...stats };
    updatedStats["% specials"] = (
      1 -
      parseFloat(updatedStats["% alphabets"]) -
      parseFloat(updatedStats["% numbers"])
    ).toFixed(2);
    
    return updatedStats;
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
              setPmsFile(e.target.files[0]);
            }
          }}
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
            {typeof decryptedData == "string" && decryptedData.length > 0 ? (
              <tr className="border-none">
                <td className="border-none font-semibold text-lg">Data:</td>
                <td className="border-none">{decryptedData}</td>
              </tr>
            ) : (
              <></>
            )}
            {typeof rawData == "string" && rawData.length > 0 ? (
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
