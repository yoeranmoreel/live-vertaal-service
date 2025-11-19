// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { sessionsApi, teacherAuth, generateSessionCode } from "@/api/sheetsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Play, History, Clock, Loader2, Users } from "lucide-react";

import SessionCard from "../components/teacher/SessionCard";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [teacher, setTeacher] = useState(null);

  // Check authentication
  useEffect(() => {
    const currentTeacher = teacherAuth.getCurrentTeacher();
    if (!currentTeacher) {
      navigate(createPageUrl("TeacherAuth"));
    } else {
      setTeacher(currentTeacher);
    }
  }, [navigate]);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', teacher?.email],
    queryFn: async () => {
      const allSessions = await sessionsApi.getAll();
      return allSessions.filter(s => s.created_by === teacher.email)
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!teacher,
    initialData: [],
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const sessionCode = generateSessionCode();
      return await sessionsApi.create({
        teacher_name: teacher.fullName || 'Leerkracht',
        session_code: sessionCode,
        source_language: 'nl',
        status: 'active',
        created_by: teacher.email
      });
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      navigate(createPageUrl("TeacherLive") + `?session=${newSession.id}`);
    },
  });

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      await createSessionMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Er ging iets mis bij het aanmaken van de sessie. Probeer het opnieuw.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const activeSessions = sessions.filter(s => s.status === 'active');
  const endedSessions = sessions.filter(s => s.status === 'ended');

  // Statistieken berekenen
  const totalParticipants = sessions.reduce((sum, s) => sum + (s.total_participants || 0), 0);
  const weekAgoSessions = sessions.filter(s => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(s.created_date) > weekAgo;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welkom terug, {teacher.fullName}! 👋
            </h1>
            <p className="text-gray-600">Beheer uw live vertaalsessies en bekijk de geschiedenis</p>
          </div>
          <Button
            onClick={handleCreateSession}
            disabled={isCreating || activeSessions.length > 0}
            className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Bezig...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Nieuwe Sessie Starten
              </>
            )}
          </Button>
        </div>
        {activeSessions.length > 0 && (
          <p className="text-sm text-amber-600 mt-2">
            ⚠️ U heeft al een actieve sessie. Beëindig deze eerst voordat u een nieuwe start.
          </p>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6 border border-white/50 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Actieve Sessies</p>
              <p className="text-2xl font-bold text-gray-900">{activeSessions.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 border border-white/50 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Totaal Sessies</p>
              <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 border border-white/50 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Afgelopen Week</p>
              <p className="text-2xl font-bold text-gray-900">{weekAgoSessions.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6 border border-white/50 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Totaal Ouders</p>
              <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-emerald-500" />
            Actieve Sessie
          </h2>
          <div className="grid gap-4">
            {activeSessions.map(session => (
              <SessionCard key={session.id} session={session} isActive />
            ))}
          </div>
        </motion.div>
      )}

      {/* Session History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600" />
          Sessiegeschiedenis
        </h2>
        {endedSessions.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center border border-white/50">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nog geen beëindigde sessies</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {endedSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
