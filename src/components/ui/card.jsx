import React from "react";

export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-card text-card-foreground rounded-lg shadow-md p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`mb-2 font-semibold text-lg ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <div className={`text-xl font-bold ${className}`} {...props}>{children}</div>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`text-gray-700 ${className}`} {...props}>{children}</div>
);

export const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`mt-2 text-sm text-gray-500 ${className}`} {...props}>{children}</div>
);
