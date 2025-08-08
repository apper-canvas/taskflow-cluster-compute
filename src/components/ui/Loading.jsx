import React from "react";
import { motion } from "framer-motion";

const Loading = ({ className }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-button w-32 animate-pulse" />
      </div>
      
      {/* Search and filters skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-6">
        <div className="h-10 bg-gray-200 rounded-md flex-1 max-w-md animate-pulse" />
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-md w-20 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Task items skeleton */}
      <div className="space-y-3 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card p-4 space-y-3"
          >
            {/* Task header */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded border-2 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;