import React from "react";

export const Dialog = ({ children, open, ...props }) => (
  open ? <div className="fixed inset-0 bg-black/50 flex items-center justify-center" {...props}>{children}</div> : null
);

export const DialogTrigger = ({ children, ...props }) => <button {...props}>{children}</button>;

export const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`bg-background rounded-lg shadow-lg p-4 ${className}`} {...props}>{children}</div>
);

export const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`mb-2 font-semibold ${className}`} {...props}>{children}</div>
);

export const DialogFooter = ({ children, className = "", ...props }) => (
  <div className={`mt-4 flex justify-end ${className}`} {...props}>{children}</div>
);

export const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold mb-2 ${className}`} {...props}>{children}</h2>
);
