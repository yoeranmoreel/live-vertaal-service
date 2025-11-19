import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, StopCircle, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpeechControls({ listening, transcribing, interimTranscript, transcriptStarted, onStart, onStop, onEnd, micPermission }) {
  return (
    <Card className="glass-effect border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {listening ? <Mic className="w-5 h-5 text-emerald-500 animate-pulse" /> : <MicOff className="w-5 h-5 text-gray-400" />}
          Spraakbesturing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {micPermission === 'denied' && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              Microfoon toegang geweigerd. Klik op het slotje in de adresbalk en geef toestemming.
            </div>
          </div>
        )}

        {micPermission === 'granted' && !transcriptStarted && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700">
              Microfoon is klaar. Klik op "Start Transcript" om te beginnen met opnemen.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {transcriptStarted ? (
            <Button
              onClick={onStop}
              variant="outline"
              className="w-full py-6 rounded-xl border-2 border-gray-300 font-semibold"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop Transcript
            </Button>
          ) : (
            <Button
              onClick={onStart}
              disabled={micPermission !== 'granted'}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Transcript
            </Button>
          )}

          <Button
            onClick={onEnd}
            variant="destructive"
            className="w-full py-6 rounded-xl font-semibold"
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Sessie Beëindigen
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>Tip: Spreek duidelijk en pauzeer tussen zinnen</p>
          <p>De microfoon luistert continu wanneer actief</p>
        </div>
      </CardContent>
    </Card>
  );
}

