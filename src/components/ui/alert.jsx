import React from "react";

export const Alert = ({ children, type = "destructive", className = "", ...props }) => {
  const base = "p-3 rounded-md mb-2";
  const variants = {
    destructive: "bg-destructive text-destructive-foreground",
    muted: "bg-muted text-muted-foreground",
    accent: "bg-accent text-accent-foreground",
  };
  return (
    <div className={`${base} ${variants[type]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = "", ...props }) => (
  <div className={`font-semibold mb-1 ${className}`} {...props}>{children}</div>
);

export const AlertDescription = ({ children, className = "", ...props }) => (
  <div className={`text-sm ${className}`} {...props}>{children}</div>
);
