import { useState } from "react";
import TimeSeriesFraudChart from "./Graph.jsx"

const Judge = () => {
  const [activeTab, setActiveTab] = useState("graph");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "graph" ? "bg-emerald-500 text-black" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("graph")}
        >
          DataSet
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "ai" ? "bg-emerald-500 text-black" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("ai")}
        >
          Reporting
        </button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="w-full max-w-5xl">
        {activeTab === "graph" ? (
          <TimeSeriesFraudChart />
        ) : (
<div className="flex flex-col items-center justify-center bg-gray-800 p-10 rounded-lg shadow-lg">
  <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
    Reported Transactions Summary
  </h2>
  <p className="text-gray-300 text-center leading-relaxed">
    This section displays data on reported transactions, highlighting potential fraud cases and anomalies detected in the system.
  </p>
</div>

        )}
      </div>
    </div>
  );
};

export default Judge;
