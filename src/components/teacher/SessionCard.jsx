// src/components/teacher/SessionCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { messagesApi } from "@/api/sheetsClient";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, Calendar, ArrowRight, Users, MessageSquare, Languages, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default function SessionCard({ session, isActive = false }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data: messages } = useQuery({
    queryKey: ['sessionMessages', session.id],
    queryFn: () => messagesApi.getBySession(session.id),
    enabled: showDetails || expanded,
    initialData: [],
  });

  const handleContinue = () => {
    navigate(createPageUrl("TeacherLive") + `?session=${session.id}`);
  };

  const handleViewDetails = () => {
    if (!isActive) {
      setShowDetails(true);
    }
  };

  const languageStats = session.language_stats || {};
  const totalParticipants = session.total_participants || 0;
  
  // Taal emoji's
  const languageEmojis = {
    'nl': '🇳🇱', 'en': '🇬🇧', 'ar': '🇸🇦', 'pl': '🇵🇱',
    'bg': '🇧🇬', 'ro': '🇷🇴', 'tr': '🇹🇷', 'uk': '🇺🇦',
    'fr': '🇫🇷', 'de': '🇩🇪', 'es': '🇪🇸', 'it': '🇮🇹'
  };

  const languageNames = {
    'nl': 'NL', 'en': 'EN', 'ar': 'AR', 'pl': 'PL',
    'bg': 'BG', 'ro': 'RO', 'tr': 'TR', 'uk': 'UK'
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-effect rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 ${
          isActive ? 'ring-2 ring-emerald-400' : 'cursor-pointer'
        }`}
        onClick={() => !isActive && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">Sessie {session.session_code}</h3>
              {isActive && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Actief
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(new Date(session.created_date), "d MMMM yyyy", { locale: nl })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {format(new Date(session.created_date), "HH:mm")}
              </div>
            </div>

            {/* Participant Statistics */}
            {totalParticipants > 0 && (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">
                    {totalParticipants} ouder{totalParticipants !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {Object.keys(languageStats).length > 0 && (
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gray-500" />
                    <div className="flex gap-1.5">
                      {Object.entries(languageStats).map(([lang, count]) => (
                        <div 
                          key={lang}
                          className="px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700 flex items-center gap-1"
                          title={`${languageNames[lang] || lang}: ${count} ouder${count !== 1 ? 's' : ''}`}
                        >
                          <span>{languageEmojis[lang] || '🌍'}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {messages && messages.length > 0 && !isActive && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <MessageSquare className="w-4 h-4" />
                <span>{messages.length} bericht{messages.length !== 1 ? 'en' : ''}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isActive ? (
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold rounded-xl"
              >
                Doorgaan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                variant="ghost"
                size="sm"
                className="rounded-lg"
              >
                {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Expanded details */}
        {expanded && messages && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Transcript voorbeelden</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {messages.slice(0, 5).map((msg, idx) => (
                <div key={msg.id} className="p-3 rounded-lg bg-gray-50 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.created_date), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {msg.original_text.length > 100 
                      ? msg.original_text.substring(0, 100) + '...' 
                      : msg.original_text
                    }
                  </p>
                </div>
              ))}
            </div>
            {messages.length > 5 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                En nog {messages.length - 5} meer bericht{messages.length - 5 !== 1 ? 'en' : ''}...
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sessie Details - {session.session_code}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Statistieken</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Totaal deelnemers</p>
                  <p className="text-xl font-bold text-gray-900">{totalParticipants}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Aantal berichten</p>
                  <p className="text-xl font-bold text-gray-900">{messages?.length || 0}</p>
                </div>
              </div>
            </div>

            {Object.keys(languageStats).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Taalverdeling</h4>
                <div className="space-y-2">
                  {Object.entries(languageStats).map(([lang, count]) => (
                    <div key={lang} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{languageEmojis[lang] || '🌍'}</span>
                        <span className="font-medium">{languageNames[lang] || lang}</span>
                      </span>
                      <span className="text-gray-600">{count} ouder{count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
