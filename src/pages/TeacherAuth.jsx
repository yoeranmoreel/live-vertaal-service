// src/pages/TeacherAuth.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { teacherAuth } from "@/api/sheetsClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, ArrowLeft, Loader2, AlertCircle, CheckCircle, Mail, Lock, User } from "lucide-react";

export default function TeacherAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Check if already logged in
  useEffect(() => {
    const currentTeacher = teacherAuth.getCurrentTeacher();
    if (currentTeacher) {
      navigate(createPageUrl("TeacherDashboard"));
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Vul alle velden in");
      return;
    }

    setLoading(true);

    try {
      const teacher = teacherAuth.login(email, password);
      
      if (teacher) {
        setSuccess("Succesvol ingelogd!");
        setTimeout(() => {
          navigate(createPageUrl("TeacherDashboard"));
        }, 500);
      } else {
        setError("Ongeldig e-mailadres of wachtwoord");
      }
    } catch (err) {
      setError("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validation
    if (!fullName.trim()) {
      setError("Vul uw volledige naam in");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
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
      const teacher = teacherAuth.register(fullName, email, password);
      
      setSuccess("Account succesvol aangemaakt! Je wordt doorgestuurd...");
      setTimeout(() => {
        navigate(createPageUrl("TeacherDashboard"));
      }, 1000);
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
          {/* Header */}
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
                : "Maak een account aan om te beginnen"
              }
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
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
                  <AlertDescription className="text-emerald-700">{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    E-mailadres
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@school.nl"
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    Wachtwoord
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Bezig met inloggen...
                    </>
                  ) : (
                    "Inloggen"
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Volledige naam
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="bijv. Jan Jansen"
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    E-mailadres
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@school.nl"
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    Wachtwoord
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimaal 6 karakters"
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    Bevestig wachtwoord
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Herhaal wachtwoord"
                    className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Account aanmaken...
                    </>
                  ) : (
                    "Account aanmaken"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors disabled:opacity-50"
            >
              {mode === "login" 
                ? "Nog geen account? Registreren →" 
                : "← Terug naar inloggen"
              }
            </button>
          </div>

          {/* Back to home */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              variant="ghost"
              className="w-full rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
