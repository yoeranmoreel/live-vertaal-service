// src/components/auth/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { teacherAuthClient } from "@/services/sheetsClient";
import { createPageUrl } from "@/utils";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function verify() {
      const result = await teacherAuthClient.verify();

      if (result.valid) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    }

    verify();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500">
        Controleert toegang...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to={createPageUrl("TeacherAuth")} replace />;
  }

  return children;
}
