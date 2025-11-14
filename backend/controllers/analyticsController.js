import MedicalMonitoring from "../models/MedicalMonitoring.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Helper function para sa percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    if (current > 0) return 100; // Kung galing 0 to any number, it's 100% increase
    return 0; // Kung 0 to 0, 0 change
  }
  return (((current - previous) / previous) * 100).toFixed(0);
};

// Helper function para sa pag-define ng respiratory symptoms
const getRespiratoryKeywords = () => {
  return /ubo|sipon|lagnat|cough|cold|fever|asthma|respiratory|sneezing|sore throat/i;
};

// Main function na kukunin lahat ng insights
export const getDashboardInsights = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 7));
    const fourteenDaysAgo = new Date(new Date().setDate(today.getDate() - 14));

    // --- Insight 1: Top Program ---
    const topProgramPromise = MedicalMonitoring.aggregate([
      {
        $match: {
          status: "approved", // Bilangin lang 'yung approved
        },
      },
      {
        $lookup: {
          from: "users", // Mula sa User collection
          localField: "studentId", // I-match ang MedicalMonitoring.studentId
          foreignField: "_id", // sa User._id
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: "$studentInfo.program", // I-grupo base sa program ng student
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          program: "$_id",
          count: 1,
        },
      },
    ]);

    // --- Insight 2: Respiratory Symptom Trend ---
    const respiratoryRegex = getRespiratoryKeywords();

    const thisWeekSymptomsPromise = MedicalMonitoring.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      symptoms: { $regex: respiratoryRegex },
      status: "approved",
    });

    const lastWeekSymptomsPromise = MedicalMonitoring.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
      symptoms: { $regex: respiratoryRegex },
      status: "approved",
    });

    // --- I-run lahat ng queries in parallel ---
    const [topProgramResult, thisWeekCount, lastWeekCount] = await Promise.all([
      topProgramPromise,
      thisWeekSymptomsPromise,
      lastWeekSymptomsPromise,
    ]);

    // --- I-format ang final response ---
    const topProgram = topProgramResult[0] || { program: "N/A", count: 0 };

    const symptomChange = calculatePercentageChange(
      thisWeekCount,
      lastWeekCount
    );

    res.json({
      topProgram: {
        name: topProgram.program,
        count: topProgram.count,
      },
      symptomTrend: {
        thisWeek: thisWeekCount,
        lastWeek: lastWeekCount,
        changePercentage: symptomChange,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard insights:", error);
    res.status(500).json({ message: "Failed to get analytics insights." });
  }
};
