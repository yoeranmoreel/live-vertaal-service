// src/components/ui/card.jsx
import React from "react";

export const Card = (props) => (
  <div className="bg-white shadow-md rounded-lg p-4" {...props}></div>
);
export const CardHeader = (props) => (
  <div className="mb-2 font-semibold text-lg" {...props}></div>
);
export const CardTitle = (props) => (
  <div className="text-xl font-bold" {...props}></div>
);
export const CardContent = (props) => (
  <div className="text-gray-700" {...props}></div>
);
export const CardFooter = (props) => (
  <div className="mt-2 text-sm text-gray-500" {...props}></div>
);
