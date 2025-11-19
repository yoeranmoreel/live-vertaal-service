import React from "react";

export const Button = ({ children, variant = "primary", disabled, ...props }) => {
  const base = "px-4 py-2 rounded-md font-medium transition-colors";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50",
  };
  return (
    <button className={`${base} ${variants[variant]}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
