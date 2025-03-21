import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Chart.js v3+
import { motion } from "framer-motion";

const TimeSeriesFraudChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("hour");

  // Function to fetch and parse CSV file from public folder
  useEffect(() => {
    fetch("/transactions.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            const rawData = result.data;
            if (rawData.length > 1) {
              // Extract headers
              const headers = rawData[0];
              const rows = rawData.slice(1);

              // Map rows to objects
              const formattedData = rows.map((row) => ({
                transaction_date: row[headers.indexOf("transaction_date")],
                is_fraud: row[headers.indexOf("is_fraud")], // 1 = Fraud, 0 = Not Fraud
              }));

              // Filter valid transactions
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

  // Function to filter transactions by time
  const filterData = (data, filter) => {
    const groupedData = {};

    data.forEach((transaction) => {
      let timeInstance;
      const dateObj = new Date(transaction.transaction_date);

      if (filter === "day") {
        timeInstance = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (filter === "hour") {
        timeInstance = dateObj.toISOString().split(":")[0] + ":00"; // YYYY-MM-DDTHH:00
      } else if (filter === "minute") {
        timeInstance = dateObj.toISOString().split(":").slice(0, 2).join(":"); // YYYY-MM-DDTHH:MM
      }

      if (!groupedData[timeInstance]) {
        groupedData[timeInstance] = { fraudCount: 0, totalCount: 0 };
      }

      groupedData[timeInstance].totalCount++; // Count all transactions

      if (transaction.is_fraud === "1") {
        groupedData[timeInstance].fraudCount++; // Count fraud transactions
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

  // Handle filter change
  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setTimeFilter(newFilter);
    filterData(transactions, newFilter);
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: filteredData.map((d) => d.time),
    datasets: [
      {
        label: "Fraudulent Transactions",
        data: filteredData.map((d) => d.fraudCount),
        borderColor: "#FF0000",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.3,
      },
      {
        label: "Total Transactions",
        data: filteredData.map((d) => d.totalCount),
        borderColor: "#00FF00",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <motion.h1
        className="text-2xl font-bold mb-6 text-emerald-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Fraud Transactions Time Series
      </motion.h1>

      {/* Time Filter Dropdown */}
      <select
        value={timeFilter}
        onChange={handleFilterChange}
        className="mb-6 p-2 bg-gray-800 text-white border rounded"
      >
        <option value="day">Day</option>
        <option value="hour">Hour</option>
        <option value="minute">Minute</option>
      </select>

      {/* Render Chart */}
      {filteredData.length > 0 ? (
        <div className="w-full max-w-4xl">
          <Line data={chartData} />
        </div>
      ) : (
        <p className="text-gray-400">Loading data from CSV...</p>
      )}
    </div>
  );
};

export default TimeSeriesFraudChart;
