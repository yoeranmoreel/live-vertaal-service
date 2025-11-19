import React from "react";

export const Badge = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
