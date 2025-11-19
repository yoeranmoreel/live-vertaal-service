
import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Languages, GraduationCap, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-indigo-100 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">Verbinding door communicatie</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                Live Vertaal Service
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Overbrüg taalbarrières in oudercontacten met real-time vertaling.
              <br />
              <span className="text-gray-500">Nederlands • English • العربية</span>
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto"
          >
            {/* Teacher Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative glass-effect rounded-3xl p-8 hover:scale-105 transition-transform duration-300 cursor-pointer border border-white/50 shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Voor Leerkrachten</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Start een live sessie, deel de QR-code en laat uw woorden automatisch vertaald worden voor alle aanwezige ouders.
                </p>
                <Button
                  onClick={() => navigate(createPageUrl("TeacherAuth"))}
                  className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold py-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  Start als Leerkracht
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Parent Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative glass-effect rounded-3xl p-8 hover:scale-105 transition-transform duration-300 cursor-pointer border border-white/50 shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Voor Ouders</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Scan de QR-code of voer de sessiecode in. Kies uw taal en ontvang real-time vertalingen tijdens het gesprek.
                </p>
                <Button
                  onClick={() => navigate(createPageUrl("ParentJoin"))}
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold py-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  Deelnemen als Ouder
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Languages, title: "Real-time Vertaling", desc: "Automatische vertaling naar Nederlands, Engels en Arabisch" },
              { icon: Sparkles, title: "Eenvoudig Te Gebruiken", desc: "QR-code scannen en direct deelnemen zonder installatie" },
              { icon: GraduationCap, title: "Voor Iedereen", desc: "Inclusief onderwijs door taalbarrières te doorbreken" }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


