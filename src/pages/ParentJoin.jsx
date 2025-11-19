import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, ArrowRight, Sparkles } from "lucide-react";

export default function ParentJoin() {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState("");

  const handleJoin = () => {
    if (!sessionCode.trim()) {
      alert("Voer een sessiecode in");
      return;
    }
    navigate(createPageUrl("ParentView") + `?session=${sessionCode.trim().toUpperCase()}`);
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welkom Ouder! 👋</h1>
            <p className="text-gray-600">Voer de sessiecode in om deel te nemen</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="sessionCode" className="text-gray-700 font-medium mb-2 block">
                Sessiecode
              </Label>
              <Input
                id="sessionCode"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Bijv. LVS-ABC123"
                className="h-14 text-lg font-mono text-center border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
              <p className="text-sm text-gray-500 mt-2">
                De code vindt u op het scherm van de leerkracht
              </p>
            </div>

            <Button
              onClick={handleJoin}
              className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Deelnemen aan Sessie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">of</span>
              </div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">
                Heeft de leerkracht een QR-code getoond? 
                <br />
                <span className="font-medium text-indigo-600">Scan deze met uw camera-app</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

