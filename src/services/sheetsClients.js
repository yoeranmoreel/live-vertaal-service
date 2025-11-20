// ========================================
// API Client for Vercel Proxy -> Google Apps Script
// ========================================

const API_URL = import.meta.env.VITE_API_URL;

// Safety check (helps debugging)
if (!API_URL) {
  console.error("❌ FATAL: VITE_API_URL is not set!");
}

// Generic fetch wrapper
async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const text = await response.text();

    // Attempt to parse JSON; fallback to text response
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Invalid JSON returned from API:", text);
      throw new Error("Invalid JSON response from API");
    }

    if (!data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data.data;
  } catch (err) {
    console.error("❌ API Error:", err);
    throw err;
  }
}

// ========================================
// SESSIONS API
// ========================================
export const sessionsApi = {
  async getAll(createdBy = null) {
    const allSessions = await apiFetch(`${API_URL}?action=getAllSessions`);

    if (createdBy) {
      return allSessions.filter(s => s.created_by === createdBy);
    }

    return allSessions;
  },

  async getByCode(sessionCode) {
    return await apiFetch(
      `${API_URL}?action=getSessionByCode&sessionCode=${encodeURIComponent(
        sessionCode
      )}`
    );
  },

  async getById(sessionId) {
    return await apiFetch(
      `${API_URL}?action=getSessionById&sessionId=${encodeURIComponent(
        sessionId
      )}`
    );
  },

  async create(sessionData) {
    return await apiFetch(`${API_URL}?action=createSession`, {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
  },

  async update(sessionId, updates) {
    return await apiFetch(
      `${API_URL}?action=updateSession&sessionId=${encodeURIComponent(
        sessionId
      )}`,
      {
        method: "POST",
        body: JSON.stringify(updates),
      }
    );
  },

  async registerParticipant(sessionId, language, participantId) {
    return await apiFetch(
      `${API_URL}?action=registerParticipant&sessionId=${encodeURIComponent(
        sessionId
      )}&language=${encodeURIComponent(
        language
      )}&participantId=${encodeURIComponent(participantId)}`,
      {
        method: "POST",
      }
    );
  },
};

// ========================================
// MESSAGES API
// ========================================
export const messagesApi = {
  async getBySession(sessionId) {
    return await apiFetch(
      `${API_URL}?action=getMessagesBySession&sessionId=${encodeURIComponent(
        sessionId
      )}`
    );
  },

  async create(messageData) {
    return await apiFetch(`${API_URL}?action=createMessage`, {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },
};

// ========================================
// TRANSLATION API
// ========================================
export const translationApi = {
  async translate(text, targetLanguage, sourceLanguage = "nl") {
    return await apiFetch(
      `${API_URL}?action=translateText&text=${encodeURIComponent(
        text
      )}&sourceLanguage=${sourceLanguage}&targetLanguage=${targetLanguage}`
    );
  },

  async translateAllMessages(sessionId, targetLanguage) {
    return await apiFetch(
      `${API_URL}?action=translateAllMessages&sessionId=${encodeURIComponent(
        sessionId
      )}&targetLanguage=${targetLanguage}`
    );
  },

  async getSupportedLanguages() {
    return await apiFetch(`${API_URL}?action=getSupportedLanguages`);
  },
};

// ========================================
// PARTICIPANT TRACKING
// ========================================
export const participantTracker = {
  getOrCreateParticipantId() {
    let id = sessionStorage.getItem("lvs_participant_id");

    if (!id) {
      id = `participant_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      sessionStorage.setItem("lvs_participant_id", id);
    }

    return id;
  },

  isRegistered(sessionId) {
    return sessionStorage.getItem(`lvs_registered_${sessionId}`) === "true";
  },

  markAsRegistered(sessionId) {
    sessionStorage.setItem(`lvs_registered_${sessionId}`, "true");
  },

  clearSession(sessionId) {
    sessionStorage.removeItem(`lvs_registered_${sessionId}`);
  },
};

// ========================================
// TEACHER AUTH
// ========================================
export const teacherAuth = {
  login(email, password) {
    const teachers = JSON.parse(localStorage.getItem("lvs_teachers") || "{}");

    if (teachers[email] && teachers[email].password === password) {
      const teacherData = {
        email,
        fullName: teachers[email].fullName,
      };
      localStorage.setItem("lvs_teacher", JSON.stringify(teacherData));
      return teacherData;
    }

    return null;
  },

  register(fullName, email, password) {
    const teachers = JSON.parse(localStorage.getItem("lvs_teachers") || "{}");

    if (teachers[email]) {
      throw new Error("Dit e-mailadres is al geregistreerd");
    }

    teachers[email] = { fullName, password };
    localStorage.setItem("lvs_teachers", JSON.stringify(teachers));

    const teacherData = { email, fullName };
    localStorage.setItem("lvs_teacher", JSON.stringify(teacherData));

    return teacherData;
  },

  getCurrentTeacher() {
    const data = localStorage.getItem("lvs_teacher");
    return data ? JSON.parse(data) : null;
  },

  logout() {
    localStorage.removeItem("lvs_teacher");
  },
};

// ========================================
// SESSION CODE GENERATOR
// ========================================
export function generateSessionCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "LVS";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}
