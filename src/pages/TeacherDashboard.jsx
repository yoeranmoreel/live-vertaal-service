// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  sessionsApi,
  teacherAuthClient,
  generateSessionCode
} from "@/services/sheetsClient";

import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Play,
  History,
  Clock,
  Loader2,
  Users
} from "lucide-react";

import SessionCard from "../components/teacher/SessionCard";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [teacher, setTeacher] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // -------------------------------------
  // AUTH CHECK (SECURE VERSION)
  // -------------------------------------
  useEffect(() => {
    async function verify() {
      const token = teacherAuthClient.getToken();
      const profile = teacherAuthClient.getProfile();

      if (!token || !profile) {
        navigate(createPageUrl("TeacherAuth"));
        return;
      }

      const result = await teacherAuthClient.verify();

      if (!result.valid) {
        navigate(createPageUrl("TeacherAuth"));
        return;
      }

      setTeacher(profile);
      setIsVerifying(false);
    }

    verify();
  }, [navigate]);

  // Still verifying? → Show spinner
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  // -------------------------------------
  // EXTRA GUARD (FIX FOR REACT ERROR #310)
  // -------------------------------------
  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  // -------------------------------------
  // LOAD SESSIONS FOR THIS TEACHER
  // -------------------------------------
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions", teacher.email],
    queryFn: async () => {
      const all = await sessionsApi.getAll();
      return all
        .filter((s) => s.created_by === teacher.email)
        .sort(
          (a, b) =>
            new Date(b.created_date) - new Date(a.created_date)
        );
    },
    enabled: !!teacher,
  });

  const activeSessions = sessions.filter(
    (s) => s.status === "active"
  );
  const endedSessions = sessions.filter(
    (s) => s.status === "ended"
  );

  // -------------------------------------
  // CREATE SESSION
  // -------------------------------------
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const sessionCode = generateSessionCode();
      return await sessionsApi.create({
        teacher_name: teacher.fullName || "Leerkracht",
        session_code: sessionCode,
        source_language: "nl",
        status: "active",
        created_by: teacher.email,
      });
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
      navigate(
        createPageUrl("TeacherLive") +
          `?session=${newSession.id}`
      );
    },
  });

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      await createSessionMutation.mutateAsync();
    } catch (err) {
      alert(
        "Er ging iets mis bij het aanmaken van de sessie."
      );
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  // -------------------------------------
  // STATS
  // -------------------------------------
  const totalParticipants = sessions.reduce(
    (sum, s) => sum + (s.total_participants || 0),
    0
  );

  const weekAgoSessions = sessions.filter((s) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(s.created_date) > weekAgo;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
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
            <p className="text-gray-600">
              Beheer uw live vertaalsessies en bekijk de geschiedenis
            </p>
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

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Active sessions */}
        <StatCard
          delay={0.1}
          icon={<Play className="w-6 h-6 text-white" />}
          title="Actieve Sessies"
          value={activeSessions.length}
          colors="from-emerald-400 to-emerald-600"
        />

        {/* Total */}
        <StatCard
          delay={0.2}
          icon={<History className="w-6 h-6 text-white" />}
          title="Totaal Sessies"
          value={sessions.length}
          colors="from-indigo-400 to-indigo-600"
        />

        {/* Week */}
        <StatCard
          delay={0.3}
          icon={<Clock className="w-6 h-6 text-white" />}
          title="Afgelopen Week"
          value={weekAgoSessions.length}
          colors="from-sky-400 to-sky-600"
        />

        {/* Participants */}
        <StatCard
          delay={0.4}
          icon={<Users className="w-6 h-6 text-white" />}
          title="Totaal Ouders"
          value={totalParticipants}
          colors="from-purple-400 to-purple-600"
        />
      </div>

      {/* ACTIVE SESSION LIST */}
      {activeSessions.length > 0 && (
        <Section title="Actieve Sessie" icon={<Play className="w-5 h-5 text-emerald-500" />}>
          {activeSessions.map((s) => (
            <div>ACTIVE SESSION CARD OK</div>
          ))}
        </Section>
      )}

      {/* ENDED SESSIONS */}
      <Section title="Sessiegeschiedenis" icon={<History className="w-5 h-5 text-gray-600" />}>
        {endedSessions.length === 0 ? (
          <EmptyHistory />
        ) : (
          endedSessions.map((s) => <div>ENDED SESSION CARD OK</div> )
        )}
      </Section>
    </div>
  );
}

function StatCard({ delay, icon, title, value, colors }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-effect rounded-2xl p-6 border border-white/50 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, icon, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="grid gap-4">{children}</div>
    </motion.div>
  );
}

function EmptyHistory() {
  return (
    <div className="glass-effect rounded-2xl p-12 text-center border border-white/50">
      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Nog geen beëindigde sessies</p>
    </div>
  );
}

