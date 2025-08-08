import React from "react";
import { motion } from "framer-motion";

const ProgressIndicator = ({ completedTasks, totalTasks }) => {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "text-green-500 border-green-500";
    if (percentage >= 50) return "text-amber-500 border-amber-500";
    return "text-gray-400 border-gray-300";
  };

  const getProgressMessage = (percentage) => {
    if (percentage === 100) return "All tasks completed! 🎉";
    if (percentage >= 80) return "Almost there! 💪";
    if (percentage >= 50) return "Good progress! 📈";
    if (percentage > 0) return "Keep going! 🚀";
    return "Ready to start? ✨";
  };

  return (
    <div className="card p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
          <p className="text-sm text-gray-600">{getProgressMessage(completionPercentage)}</p>
        </div>
        
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <motion.path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={completionPercentage >= 80 ? "#4CAF50" : completionPercentage >= 50 ? "#FFB74D" : "#5B4FE8"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${completionPercentage}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${completionPercentage}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-sm font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {completionPercentage}%
            </motion.span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{completedTasks} completed</span>
        <span>{totalTasks} total tasks</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;