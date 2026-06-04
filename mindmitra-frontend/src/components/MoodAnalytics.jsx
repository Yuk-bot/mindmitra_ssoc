import React, { useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Mock Data for Preview
const weeklyLineData = [
  { name: "Mon", MoodScore: 4 },
  { name: "Tue", MoodScore: 3 },
  { name: "Wed", MoodScore: 5 },
  { name: "Thu", MoodScore: 2 },
  { name: "Fri", MoodScore: 4 },
  { name: "Sat", MoodScore: 5 },
  { name: "Sun", MoodScore: 4 },
];

const monthlyLineData = [
  { name: "Wk 1", MoodScore: 3.8 },
  { name: "Wk 2", MoodScore: 4.2 },
  { name: "Wk 3", MoodScore: 3.5 },
  { name: "Wk 4", MoodScore: 4.5 },
];

const weeklyPieData = [
  { name: "Happy", value: 4, color: "#10B981" },
  { name: "Calm", value: 2, color: "#3B82F6" },
  { name: "Anxious", value: 1, color: "#F59E0B" },
  { name: "Sad", value: 0, color: "#EF4444" },
];

const monthlyPieData = [
  { name: "Happy", value: 12, color: "#10B981" },
  { name: "Calm", value: 10, color: "#3B82F6" },
  { name: "Anxious", value: 5, color: "#F59E0B" },
  { name: "Sad", value: 3, color: "#EF4444" },
];

export default function MoodAnalytics() {
  const [viewType, setViewType] = useState("weekly");
  const reportRef = useRef(null);

  const isWeekly = viewType === "weekly";
  const lineData = isWeekly ? weeklyLineData : monthlyLineData;
  const pieData = isWeekly ? weeklyPieData : monthlyPieData;

  // PDF Export Logic
  const exportToPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; 
      const pageHeight = 295; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`mood-analytics-${viewType}-report.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Top Interactive Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mood Analytics</h1>
          <p className="text-sm text-gray-500">Track and visualize emotional trends</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Weekly vs Monthly Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center shadow-inner">
            <button
              onClick={() => setViewType("weekly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                isWeekly ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewType("monthly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                !isWeekly ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* PDF Export Action */}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Content Area */}
      <div ref={reportRef} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {viewType} Dashboard View
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Trend Line Chart */}
          <div className="lg:col-span-2 border border-gray-100 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Mood Over Time</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#9CA3AF" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                    formatter={(value) => [`Score: ${value}`, "Mood"]}
                  />
                  <Line type="monotone" dataKey="MoodScore" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emotion Distribution Pie Chart */}
          <div className="border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Emotion Distribution</h3>
            </div>
            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} days`, "Frequency"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend Indicators */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
