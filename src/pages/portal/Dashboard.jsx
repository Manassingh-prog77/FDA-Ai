import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Map,
  Download,
  Lock,MailWarning,Activity,ShieldCheck,
  Clock,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  useSpeechRecognition,
} from "react-speech-recognition";
import legalApiService from "../../services/legalApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
   
} from "recharts";

// Hardcoded sample data remains unchanged
const SAMPLE_TREND_DATA = [
  { period: "Jan", count: 120, growthRate: 5 },
  { period: "Feb", count: 150, growthRate: 25 },
  { period: "Mar", count: 180, growthRate: 20 },
  { period: "Apr", count: 140, growthRate: -22 },
  { period: "May", count: 200, growthRate: 42 },
  { period: "Jun", count: 220, growthRate: 10 },
];

const SAMPLE_DISTRIBUTION_DATA = [
  { name: "Cyber Crime", value: 300 },
  { name: "Financial Fraud", value: 250 },
  { name: "Property Crime", value: 180 },
  { name: "Violent Crime", value: 150 },
  { name: "Narcotics", value: 100 },
];

const SAMPLE_HOTSPOT_DATA = [
  { location: "Mumbai", riskScore: 8.5, incidentCount: 245 },
  { location: "Delhi", riskScore: 7.2, incidentCount: 198 },
  { location: "Bangalore", riskScore: 6.8, incidentCount: 167 },
];

const SAMPLE_RECOMMENDATIONS = [
  {
    title: "Increase Cyber Patrols",
    description: "Deploy additional cybercrime units in high-risk zones.",
    metrics: "30% reduction in cyber incidents",
  },
  {
    title: "CCTV Installation",
    description: "Install surveillance in identified hotspots.",
    metrics: "25% decrease in property crime",
  },
];

// Updated colors to match LegalKnowledge/DetectiveEngine theme
const COLORS = [
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
];

// Background Effect Component from LegalKnowledge
const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-screen h-screen">
      <div className="absolute w-96 h-96 -top-48 -left-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute w-96 h-96 top-1/3 right-1/4 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  </div>
);

const Dashboard = () => {
  // All state declarations remain unchanged
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [error, setError] = useState(null);
  const isListening = false;
  const [timeRange, setTimeRange] = useState("last30days");
  const [region, setRegion] = useState("all");
  const [crimeType, setCrimeType] = useState("all");
  const [activeTab, setActiveTab] = useState("trends");


  const commands = [
    { command: "reset", callback: () => resetTranscript() },
    { command: "analyze", callback: () => handleAnalysis() },
    { command: "filter by region *", callback: (region) => setRegion(region) },
    { command: "filter by crime *", callback: (type) => setCrimeType(type) },
  ];

  const {
    transcript,
    resetTranscript,
  } = useSpeechRecognition({ commands });

  // All useEffect hooks remain unchanged
  useEffect(() => {
    setAnalysisResults({
      summary: "Sample analysis showing crime trends across regions.",
      keyInsights: ["Cybercrime up by 25%", "Mumbai shows highest risk"],
      trendData: SAMPLE_TREND_DATA,
      distributionData: SAMPLE_DISTRIBUTION_DATA,
      hotspotData: SAMPLE_HOTSPOT_DATA,
      recommendations: SAMPLE_RECOMMENDATIONS,
    });
    fetchAnalysisHistory();
  }, []);

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  const fetchAnalysisHistory = async () => {
    try {
      const history = await legalApiService.getCrimeAnalysisHistory();
      setAnalysisHistory(history || []);
    } catch (error) {
      console.error("Failed to fetch analysis history:", error);
    }
  };

  const handleAnalysis = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = { query, timeRange, region, crimeType };
      const data = await legalApiService.analyzeCrimeData(params);
      setAnalysisResults(
        data || {
          summary: "Sample analysis showing crime trends across regions.",
          keyInsights: ["Cybercrime up by 25%", "Mumbai shows highest risk"],
          trendData: SAMPLE_TREND_DATA,
          distributionData: SAMPLE_DISTRIBUTION_DATA,
          hotspotData: SAMPLE_HOTSPOT_DATA,
          recommendations: SAMPLE_RECOMMENDATIONS,
        }
      );
      fetchAnalysisHistory();
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisResults({
        summary: "Sample analysis showing crime trends across regions.",
        keyInsights: ["Cybercrime up by 25%", "Mumbai shows highest risk"],
        trendData: SAMPLE_TREND_DATA,
        distributionData: SAMPLE_DISTRIBUTION_DATA,
        hotspotData: SAMPLE_HOTSPOT_DATA,
        recommendations: SAMPLE_RECOMMENDATIONS,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = async (historyId) => {
    try {
      setIsLoading(true);
      setError(null);

      const analysisData = await legalApiService.getAnalysisDetails(historyId);
      setQuery(analysisData.query);
      setAnalysisResults(analysisData.results);
      setTimeRange(analysisData.timeRange);
      setRegion(analysisData.region);
      setCrimeType(analysisData.crimeType);
    } catch (error) {
      console.error("Failed to load analysis details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTrendChart = () => {
    // Fraud trend dataset (Quarterly analysis)
    const fraudTrendData = [
      { period: "Q1", fraudCases: 120, riskScore: 35 },
      { period: "Q2", fraudCases: 150, riskScore: 40 },
      { period: "Q3", fraudCases: 180, riskScore: 45 },
      { period: "Q4", fraudCases: 200, riskScore: 50 },
    ];
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30 shadow-lg mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          {/* Section Title */}
          <h3 className="text-lg font-semibold text-cyan-400">Fraud Trend Analysis</h3>
  
          {/* Export Button */}
          <motion.button
            onClick={() => alert("Exporting fraud trend data...")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-md transition-all"
          >
            <Download className="w-4 h-4" />
            Export Data
          </motion.button>
        </div>
  
        {/* Chart Container */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={fraudTrendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            {/* Grid Lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#06B6D4" opacity={0.2} />
  
            {/* X & Y Axis Config */}
            <XAxis
              dataKey="period"
              angle={-45}
              textAnchor="end"
              height={70}
              stroke="#A5B4FC"
              label={{ position: "insideBottom", offset: -20, fill: "#A5B4FC" }}
            />
            <YAxis stroke="#A5B4FC" label={{ value: "Fraud Cases", angle: -90, position: "insideLeft", fill: "#A5B4FC" }} />
  
            {/* Tooltip Styling */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #06B6D4",
                color: "#E0E7FF",
              }}
            />
  
            {/* Legend for better understanding */}
            <Legend wrapperStyle={{ color: "#A5B4FC" }} />
  
            {/* Fraud Cases & Risk Score Bars */}
            <Bar dataKey="fraudCases" name="Fraud Cases" fill="#F87171" />
            <Bar dataKey="riskScore" name="Risk Score (%)" fill="#FACC15" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };
  
  

  const renderDistributionChart = () => {
    const fraudDistributionData = [
      { name: "Online Scams", value: 40 },
      { name: "Card Fraud", value: 30 },
      { name: "Identity Theft", value: 15 },
      { name: "Phishing Attacks", value: 10 },
      { name: "Unauthorized Transactions", value: 5 },
    ];
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30 shadow-lg mb-6"
      >
        {/* Section Title */}
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Fraud Distribution Analysis</h3>
  
        {/* Chart Container */}
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={fraudDistributionData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {fraudDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
  
            {/* Tooltip for Fraud Type Details */}
            <Tooltip
              formatter={(value, name) => [`${value} cases`, `${name}`]}
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #06B6D4",
                color: "#E0E7FF",
              }}
            />
  
            {/* Legend for fraud categories */}
            <Legend wrapperStyle={{ color: "#A5B4FC" }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };
  
  const renderHotspotMap = () => {
    // Default hotspot data for career guidance analysis
    const fraudHotspotData = [
      { location: "Silicon Valley - Tech Fraud", riskScore: 9, incidentCount: 120, severity: "Critical" },
      { location: "New York - Banking Fraud", riskScore: 8, incidentCount: 95, severity: "High" },
      { location: "Los Angeles - Identity Theft", riskScore: 7, incidentCount: 75, severity: "Medium" },
      { location: "Chicago - Phishing Attacks", riskScore: 6, incidentCount: 50, severity: "Medium" },
      { location: "Houston - Retail Scams", riskScore: 5, incidentCount: 30, severity: "Low" },
    ];
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-xl border border-red-500/30 shadow-lg mb-6"
      >
        {/* Section Title */}
        <h3 className="text-lg font-semibold text-red-400 mb-4">Fraud Risk Hotspot Analysis</h3>
  
        {/* Hotspot List */}
        <div className="border border-red-500/20 rounded-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-red-500/20">
            <h4 className="font-medium text-gray-300">Top High-Risk Areas</h4>
          </div>
  
          <ul className="divide-y divide-red-500/20">
            {fraudHotspotData.map((area, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 flex items-start gap-3"
              >
                {/* Rank Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    area.riskScore >= 8
                      ? "bg-red-500/20 text-red-400"
                      : area.riskScore >= 6
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {index + 1}
                </div>
  
                {/* Fraud Location Details */}
                <div>
                  <p className="font-medium text-gray-300">{area.location}</p>
                  <div className="flex gap-6 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Score: {area.riskScore}/10
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {area.incidentCount} reported cases
                    </span>
                  </div>
  
                  {/* Risk Severity Indicator */}
                  <div className="mt-2">
                    <div className="text-xs font-medium mb-1 flex justify-between text-red-400">
                      <span>Fraud Severity</span>
                      <span
                        className={
                          area.riskScore >= 8
                            ? "text-red-400"
                            : area.riskScore >= 6
                            ? "text-orange-400"
                            : "text-yellow-400"
                        }
                      >
                        {area.severity}
                      </span>
                    </div>
                    <div className="w-full bg-red-500/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${area.riskScore * 10}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2 rounded-full ${
                          area.riskScore >= 8
                            ? "bg-red-500"
                            : area.riskScore >= 6
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  };
  

  const renderRecommendations = () => {
    const fraudPreventionTips = [
      {
        title: 'Monitor Unusual Transactions',
        description:
          'Use AI-powered fraud detection systems to monitor unusual patterns, such as high-value transactions or multiple withdrawals within a short period.',
        metrics: 'Impact: +40% reduction in fraudulent transactions',
        color: 'red',
        icon: <AlertTriangle className="w-4 h-4" />,
        impact: 40,
      },
      {
        title: 'Enable Multi-Factor Authentication (MFA)',
        description:
          'Adding MFA to your authentication process significantly reduces unauthorized access attempts by requiring an additional verification step.',
        metrics: 'Impact: +60% increase in account security',
        color: 'blue',
        icon: <ShieldCheck className="w-4 h-4" />,
        impact: 60,
      },
      {
        title: 'Use Real-Time Transaction Analysis',
        description:
          'Implement real-time analytics to identify suspicious transaction behavior instantly and block fraudulent activities before they occur.',
        metrics: 'Impact: +35% improvement in fraud detection accuracy',
        color: 'green',
        icon: <Activity className="w-4 h-4" />,
        impact: 35,
      },
      {
        title: 'Educate Users on Phishing Scams',
        description:
          'Regularly inform customers about phishing scams and social engineering attacks that trick them into revealing sensitive information.',
        metrics: 'Impact: +50% reduction in successful phishing attacks',
        color: 'yellow',
        icon: <MailWarning className="w-4 h-4" />,
        impact: 50,
      },
      {
        title: 'Encrypt Sensitive Data',
        description:
          'Ensure end-to-end encryption of payment information and personal data to prevent unauthorized access and data breaches.',
        metrics: 'Impact: +70% increase in data security',
        color: 'purple',
        icon: <Lock className="w-4 h-4" />,
        impact: 70,
      },
    ];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/50 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/20 mb-6"
      >
        <h3 className="text-lg font-medium text-red-400 mb-4">
          Fraud Prevention Strategies
        </h3>
        <ul className="space-y-3">
          {fraudPreventionTips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              {/* Icon with dynamic color */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-${tip.color}-500/10 text-${tip.color}-400`}
              >
                {tip.icon}
              </div>
    
              {/* Fraud Prevention Content */}
              <div>
                <p className="font-medium text-gray-300">{tip.title}</p>
                <p className="text-sm text-gray-400 mt-1">{tip.description}</p>
    
                {/* Expected Impact Section */}
                {tip.metrics && (
                  <div className="mt-2 p-2 rounded bg-gray-900 border border-gray-700">
                    <p className="text-xs text-gray-400">Expected impact:</p>
                    <p className="text-sm font-medium text-red-400">{tip.metrics}</p>
    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tip.impact}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2 rounded-full bg-${tip.color}-500`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );    
  };
  

  const renderTabContent = () => {
    switch (activeTab) {
      case "trends":
        return renderTrendChart();
      case "distribution":
        return renderDistributionChart();
      case "hotspots":
        return renderHotspotMap();
      case "recommendations":
        return renderRecommendations();
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-full">
      <BackgroundEffect />
      <motion.div
        className="relative z-10 max-w-6xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/20 mb-6">
          <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-cyan-400">
              <BarChart3 className="w-6 h-6" />
              Market Matrix
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
            Discover market trends, pinpoint high-risk areas, and anticipate emerging challenges with AI-powered insights.
            </p>
          </div>

          <div className="p-6">
            

            <AnimatePresence>
              {isListening && transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <p className="text-sm text-cyan-400">
                    <span className="font-medium">Current transcript:</span>{" "}
                    {transcript}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center my-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"
                />
              </motion.div>
            )}

            {analysisResults && !isLoading && (
              <div className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-black/50 backdrop-blur-xl p-6 rounded-lg border border-cyan-500/20 mb-6">
                  <h3 className="text-lg font-medium text-cyan-400 mb-2">
                    Analysis Overview
                  </h3>
                  <p className="text-gray-300">Explore in-depth analyses revealing fraud patterns across industries and regions with AI-powered detection.</p>
                  {analysisResults.keyInsights && (
                    <div className="mt-4">
                      <h4 className="font-medium text-cyan-400 mb-2">
                        Key Insights
                      </h4>
                      <ul className="space-y-1 text-gray-400">
                          <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2">
                            <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-400" />
                            <span>Rising Fraud Tactics: Emerging threats in AI, fintech, and cybersecurity are fueling a surge in fraudulent activities, highlighting the need for advanced detection systems to safeguard transactions and prevent financial crimes.</span>
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2">
                            <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-400" />
                            <span>Expanding Fraud Risks: The shift to digital transactions has opened new avenues for cybercriminals, making it crucial to implement robust fraud detection systems that adapt to evolving threats and secure financial integrity.</span>
                          </motion.li>
                      </ul>
                    </div>
                  )}
                </motion.div>

                <div className="flex border-b border-cyan-500/20 mb-6 overflow-x-auto">
                  {[
                    { id: "trends", icon: TrendingUp, label: "Fraud Trends" },
                    {
                      id: "distribution",
                      icon: PieChartIcon,
                      label: "Fraud Distribution",
                    },
                    { id: "hotspots", icon: Map, label: " Fraud Zone" },
                    {
                      id: "recommendations",
                      icon: AlertTriangle,
                      label: "Recommendations",
                    },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-cyan-500 text-cyan-400"
                          : "border-transparent text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50"
                      }`}>
                      <div className="flex items-center gap-1">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {renderTabContent()}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/20">
          <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-cyan-400">
              <Clock className="w-6 h-6" />
              Analysis Archives
            </h2>
          </div>

          <div className="p-6">
            {analysisHistory.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No analysis archives yet.
              </p>
            ) : (
              <ul className="divide-y divide-cyan-500/20">
                {analysisHistory.map((item) => (
                  <motion.li
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ backgroundColor: "rgba(6, 182, 212, 0.05)" }}
                    className="py-4 cursor-pointer transition-colors px-2 rounded"
                    onClick={() => handleHistoryItemClick(item._id)}>
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-300">
                          {item.query}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                            {item.timeRange}
                          </span>
                          {item.region !== "all" && (
                            <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                              Region: {item.region}
                            </span>
                          )}
                          {item.crimeType !== "all" && (
                            <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                              Crime: {item.crimeType}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
