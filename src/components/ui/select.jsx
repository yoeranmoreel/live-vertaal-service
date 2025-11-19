import React from "react";

export const Select = ({ className = "", ...props }) => (
  <select
    className={`border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full ${className}`}
    {...props}
  />
);

export const SelectTrigger = Select;
export const SelectContent = ({ children, className = "", ...props }) => (
  <div className={`bg-background border border-input rounded-md p-2 ${className}`} {...props}>{children}</div>
);

export const SelectItem = ({ children, className = "", ...props }) => (
  <div className={`px-2 py-1 hover:bg-primary/10 cursor-pointer ${className}`} {...props}>{children}</div>
);

export const SelectValue = ({ children, className = "", ...props }) => (
  <span className={`font-medium ${className}`} {...props}>{children}</span>
);
