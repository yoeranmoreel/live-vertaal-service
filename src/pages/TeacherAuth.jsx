// src/pages/TeacherAuth.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { teacherAuthClient } from "@/services/sheetsClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  User
} from "lucide-react";

export default function TeacherAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // If already logged in → redirect
  useEffect(() => {
    const profile = teacherAuthClient.getProfile();
    const token = teacherAuthClient.getToken();

    if (profile && token) {
      navigate(createPageUrl("TeacherDashboard"));
    }
  }, [navigate]);

  // -----------------------------
  // LOGIN HANDLER
  // -----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Vul alle velden in");
      return;
    }

    setLoading(true);

    try {
      const data = await teacherAuthClient.login(email.trim(), password.trim());
      setSuccess("Succesvol ingelogd!");

      setTimeout(() => {
        navigate(createPageUrl("TeacherDashboard"));
      }, 600);
    } catch (err) {
      setError(err.message || "Ongeldig e-mailadres of wachtwoord");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // REGISTER HANDLER
  // -----------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Vul uw volledige naam in");
      return;
    }
    if (!email.includes("@")) {
      setError("Vul een geldig e-mailadres in");
      return;
    }
    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 karakters zijn");
      return;
    }
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    setLoading(true);

    try {
      await teacherAuthClient.register(fullName.trim(), email.trim(), password.trim());

      setSuccess("Account succesvol aangemaakt! Je wordt doorgestuurd...");

      setTimeout(() => {
        navigate(createPageUrl("TeacherDashboard"));
      }, 900);
    } catch (err) {
      setError(err.message || "Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setSuccess(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-3xl p-8 border border-white/50 shadow-2xl">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === "login" ? "Welkom terug!" : "Account aanmaken"}
            </h1>
            <p className="text-gray-600">
              {mode === "login"
                ? "Log in om uw sessies te beheren"
                : "Maak een account aan om te beginnen"}
            </p>
          </div>

          {/* ALERTS */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert className="border-emerald-200 bg-emerald-50">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700">
                    {success}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORMS */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <Label className="font-medium flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    E-mailadres
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    disabl
