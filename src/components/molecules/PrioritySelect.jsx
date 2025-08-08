import React from "react";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const PrioritySelect = ({ value, onChange, className }) => {
  const priorities = [
    { value: "low", label: "Low Priority", icon: "ArrowDown", color: "text-green-500" },
    { value: "medium", label: "Medium Priority", icon: "Minus", color: "text-amber-500" },
    { value: "high", label: "High Priority", icon: "ArrowUp", color: "text-red-500" },
  ];

  const selectedPriority = priorities.find(p => p.value === value);

  return (
    <div className={`relative ${className}`}>
      {selectedPriority && (
        <ApperIcon 
          name={selectedPriority.icon} 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${selectedPriority.color}`}
          size={16} 
        />
      )}
      <Select
        value={value}
        onChange={onChange}
        className="pl-9"
      >
        <option value="">Select Priority</option>
        {priorities.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default PrioritySelect;