import React from "react";

export const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full ${className}`}
    {...props}
  />
);
