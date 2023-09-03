import React, { useEffect, useState } from "react";
import CustomFileInput from "./CustomFileInput";
import CustomPicker from "./CustomPicker";

const App = () => {
  const [pendingData, setPendingData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [limit, setLimit] = useState(20);
  const [fromTime, setFromTime] = useState(
    new Date("2023-09-01 00:00:00").toISOString()
  );

  const getPendingData = async () => {
    setPendingData([]);

    try {
      const res = await fetch("http://localhost:3000/pendingData", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const penData = await res.json();
      setPendingData(penData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProcessedData = async () => {
    setProcessedData([]);

    try {
      const res = await fetch(
        `http://localhost:3000/data?from=${fromTime}&limit=${limit}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const procData = await res.json();
      setProcessedData(procData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changedLimit = (e) => {
    setLimit(Number(e.target.value));
  };

  useEffect(() => {
    console.log(processedData);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="block max-w-6xl p-6 space-y-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Control Panel
        </h5>

        <CustomFileInput />
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              From
            </label>

            <CustomPicker setFromTime={setFromTime} />
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Limit
            </label>
            <input
              onChange={changedLimit}
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
              focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=" "
              required
            />
          </div>
        </div>

        {/*Tables*/}
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="w-full mb-6 group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Pending Data
            </label>
            <div className="h-40 overflow-scroll shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-52">
                      K
                    </th>
                    <th scope="col" className="px-6 py-3 w-52">
                      D
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pendingData.map((dataObj) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{dataObj.K}</td>
                      <td className="px-6 py-4">{dataObj.D}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full mb-6 group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Processed Data
            </label>
            <div className="h-40 overflow-scroll shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-52">
                      K
                    </th>
                    <th scope="col" className="px-6 py-3 w-52">
                      D
                    </th>
                    <th scope="col" className="px-6 py-3 w-52">
                      T
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {processedData.map((dataObj) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{dataObj.k}</td>
                      <td className="px-6 py-4">{dataObj.d}</td>
                      <td className="px-6 py-4">
                        {new Date(dataObj.t).toLocaleString("it")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="w-full mb-6 group">
            <button
              onClick={getPendingData}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
              text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Fetch pending data
            </button>
          </div>

          <div className="w-full mb-6 group">
            <button
              onClick={getProcessedData}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
              text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Fetch processed data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
