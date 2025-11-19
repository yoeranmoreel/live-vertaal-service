// src/pages/ParentView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { sessionsApi, messagesApi, translationApi, participantTracker } from "@/api/sheetsClient";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, AlertCircle, CheckCircle, FileText, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import LanguageSelector from "../components/parent/LanguageSelector";
import TranslationDisplay from "../components/parent/TranslationDisplay";

export default function ParentView() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const sessionCode = urlParams.get('session');

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [joined, setJoined] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [participantId] = useState(() => participantTracker.getOrCreateParticipantId());
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['parentSession', sessionCode],
    queryFn: async () => {
      const sess = await sessionsApi.getByCode(sessionCode);
      if (!sess) throw new Error('Sessie niet gevonden');
      return sess;
    },
    enabled: !!sessionCode,
    retry: 1,
  });

  const { data: messages } = useQuery({
    queryKey: ['parentMessages', session?.id],
    queryFn: () => messagesApi.getBySession(session.id),
    enabled: !!session && joined,
    refetchInterval: 3000, // Poll elke 3 seconden
    initialData: [],
  });

  // Registreer participant wanneer taal gekozen wordt
  useEffect(() => {
    const registerParticipant = async () => {
      if (session && selectedLanguage && !participantTracker.isRegistered(session.id)) {
        try {
          await sessionsApi.registerParticipant(session.id, selectedLanguage, participantId);
          participantTracker.markAsRegistered(session.id);
        } catch (error) {
          console.error('Failed to register participant:', error);
        }
      }
    };

    registerParticipant();
  }, [session, selectedLanguage, participantId]);

  // Vertaal nieuwste bericht
  useEffect(() => {
    const translateLatest = async () => {
      if (messages && messages.length > 0 && selectedLanguage) {
        const latest = messages[0];
        
        if (latestMessage?.id !== latest.id) {
          setLatestMessage(latest);
          setTranslating(true);
          
          try {
            const translation = await translationApi.translate(latest.original_text, selectedLanguage);
            setTranslatedText(translation);
            
            // Auto-play speech
            speakText(translation, selectedLanguage);
          } catch (error) {
            console.error('Translation error:', error);
            setTranslatedText('[Vertaling mislukt]');
          } finally {
            setTranslating(false);
          }
        }
      }
    };

    translateLatest();
  }, [messages, selectedLanguage]);

  const handleJoin = () => {
    if (!selectedLanguage) {
      alert('Selecteer eerst een taal');
      return;
    }
    setJoined(true);
  };

  const speakText = (text, language) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getVoiceLanguage(language);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getVoiceLanguage = (langCode) => {
    const voiceMap = {
      'nl': 'nl-NL', 'en': 'en-US', 'ar': 'ar-SA', 'pl': 'pl-PL',
      'bg': 'bg-BG', 'ro': 'ro-RO', 'tr': 'tr-TR', 'uk': 'uk-UA',
      'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES', 'it': 'it-IT',
      'pt': 'pt-PT', 'ru': 'ru-RU', 'zh': 'zh-CN', 'ja': 'ja-JP'
    };
    return voiceMap[langCode] || 'en-US';
  };

  const handleDownloadPdf = async () => {
    if (!session || !selectedLanguage) return;
    
    setDownloadingPdf(true);
    try {
      // Haal alle vertaalde berichten op
      const translatedMessages = await translationApi.translateAllMessages(session.id, selectedLanguage);
      
      // Genereer PDF (via browser print)
      const printWindow = window.open('', '_blank');
      const languageNames = {
        'nl': 'Nederlands', 'en': 'English', 'ar': 'العربية',
        'pl': 'Polski', 'bg': 'Български', 'ro': 'Română', 'tr': 'Türkçe'
      };
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Transcript - ${session.session_code}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 800px; 
              margin: 40px auto; 
              padding: 20px;
              direction: ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'};
            }
            h1 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
            .meta { color: #666; margin-bottom: 30px; }
            .message { 
              margin-bottom: 20px; 
              padding: 15px; 
              background: #f9fafb; 
              border-left: 4px solid #4F46E5;
              border-radius: 4px;
            }
            .timestamp { color: #999; font-size: 12px; margin-bottom: 5px; }
            .text { line-height: 1.6; }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              text-align: center; 
              color: #666; 
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>Live Vertaal Service - Transcript</h1>
          <div class="meta">
            <p><strong>Sessie:</strong> ${session.session_code}</p>
            <p><strong>Leerkracht:</strong> ${session.teacher_name}</p>
            <p><strong>Datum:</strong> ${new Date(session.created_date).toLocaleString('nl-NL')}</p>
            <p><strong>Taal:</strong> ${languageNames[selectedLanguage] || selectedLanguage}</p>
          </div>
          
          ${translatedMessages.map(msg => `
            <div class="message">
              <div class="timestamp">${new Date(msg.created_date).toLocaleTimeString('nl-NL')}</div>
              <div class="text">${msg.translation}</div>
            </div>
          `).join('')}
          
          <div class="footer">
            <p>Live Vertaal Service © ${new Date().getFullYear()} - Ontwikkeld door Yoeran Moreel</p>
            <p>Dit transcript is automatisch gegenereerd en vertaald</p>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wacht even en trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 250);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Er ging iets mis bij het genereren van de PDF. Probeer het opnieuw.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">
            Sessie niet gevonden. Controleer de sessiecode en probeer het opnieuw.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => navigate(createPageUrl("ParentJoin"))}
          className="mt-4 w-full"
          variant="outline"
        >
          Terug naar invoerscherm
        </Button>
      </div>
    );
  }

  if (session.status === 'ended') {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <Alert>
          <CheckCircle className="h-5 w-5" />
          <AlertDescription className="text-base">
            Deze sessie is beëindigd door de leerkracht.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 border border-white/50 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sessie gevonden!</h1>
            <p className="text-gray-600">Leerkracht: {session.teacher_name}</p>
            <p className="text-sm text-gray-500">Code: {session.session_code}</p>
          </div>

          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={setSelectedLanguage}
          />

          <Button
            onClick={handleJoin}
            disabled={!selectedLanguage}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            Deelnemen aan Sessie
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Vertaling</h1>
            <p className="text-gray-600">Leerkracht: {session.teacher_name}</p>
          </div>
          <Button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || !messages || messages.length === 0}
            variant="outline"
            className="rounded-xl"
          >
            {downloadingPdf ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>
      </motion.div>

      <TranslationDisplay
        originalText={latestMessage?.original_text}
        translatedText={translatedText}
        translating={translating}
        selectedLanguage={selectedLanguage}
        onSpeak={() => latestMessage && speakText(translatedText, selectedLanguage)}
      />

      {/* Presentation text if available */}
      {session.presentation_text && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 glass-effect rounded-2xl p-6 border border-white/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900">Presentatie Tekst</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {session.presentation_text}
          </p>
        </motion.div>
      )}
    </div>
  );
}
