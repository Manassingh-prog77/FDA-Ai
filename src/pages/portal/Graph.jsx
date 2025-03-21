import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { motion } from "framer-motion";

const TimeSeriesFraudChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("hour");

  useEffect(() => {
    fetch("/plotting.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            const rawData = result.data;
            if (rawData.length > 1) {
              const headers = rawData[0];
              const rows = rawData.slice(1);

              const formattedData = rows.map((row) => ({
                transaction_date: row[headers.indexOf("transaction_date")],
                is_fraud: row[headers.indexOf("is_fraud")],
              }));

              const validTransactions = formattedData.filter(
                (item) => item.transaction_date && item.is_fraud !== undefined
              );

              setTransactions(validTransactions);
              filterData(validTransactions, "hour");
            }
          },
          header: false,
          skipEmptyLines: true,
        });
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  }, []);

  const filterData = (data, filter) => {
    const groupedData = {};

    data.forEach((transaction) => {
      let timeInstance;
      const dateObj = new Date(transaction.transaction_date);

      if (filter === "day") {
        timeInstance = dateObj.toISOString().split("T")[0];
      } else if (filter === "hour") {
        timeInstance = dateObj.toISOString().split(":")[0] + ":00";
      } else if (filter === "minute") {
        timeInstance = dateObj.toISOString().split(":").slice(0, 2).join(":");
      }

      if (!groupedData[timeInstance]) {
        groupedData[timeInstance] = { fraudCount: 0, totalCount: 0 };
      }

      groupedData[timeInstance].totalCount++;
      if (transaction.is_fraud === "1") {
        groupedData[timeInstance].fraudCount++;
      }
    });

    setFilteredData(
      Object.entries(groupedData).map(([time, { fraudCount, totalCount }]) => ({
        time,
        fraudCount,
        totalCount,
      }))
    );
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setTimeFilter(newFilter);
    filterData(transactions, newFilter);
  };

  const handleDownloadCSV = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reported_transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const chartData = {
    labels: filteredData.map((d) => d.time),
    datasets: [
      {
        label: "Fraudulent Transactions",
        data: filteredData.map((d) => d.fraudCount),
        borderColor: "#ff4b4b",
        backgroundColor: "rgba(255, 75, 75, 0.2)",
        tension: 0.3,
        pointBorderColor: "#ff0000",
        pointBackgroundColor: "#ff0000",
        pointRadius: 4,
      },
      {
        label: "Total Transactions",
        data: filteredData.map((d) => d.totalCount),
        borderColor: "#00c853",
        backgroundColor: "rgba(0, 200, 83, 0.2)",
        tension: 0.3,
        pointBorderColor: "#00ff00",
        pointBackgroundColor: "#00ff00",
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <motion.h1
        className="text-3xl font-bold mb-6 text-emerald-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Fraud Transactions Time Series
      </motion.h1>

<div style={{display:"flex",justifyContent:"space-between",width:"30%"}}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <select
          value={timeFilter}
          onChange={handleFilterChange}
          className="mb-6 p-2 px-4 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-400 transition duration-200"
        >
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="minute">Minute</option>
        </select>
      </motion.div>

      {/* Export CSV Button */}
      <motion.button
        onClick={handleDownloadCSV}
        className="mb-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        whileHover={{ scale: 1.05 }}
      >
        Export CSV
      </motion.button>
    </div>

      <motion.div
        className="w-full max-w-5xl bg-gray-800 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {filteredData.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-gray-400 text-center">Loading data from CSV...</p>
        )}
      </motion.div>
    </div>
  );
};

export default TimeSeriesFraudChart;
