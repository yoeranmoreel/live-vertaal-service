import React from "react";

export const Label = ({ children, className = "", ...props }) => (
  <label className={`block mb-1 font-medium ${className}`} {...props}>
    {children}
  </label>
);
