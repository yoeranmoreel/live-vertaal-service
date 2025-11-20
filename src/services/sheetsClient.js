// src/services/sheetsClient.js
// Revised API client (Vercel proxy -> Google Apps Script)
// Includes teacherAuth endpoints that use the Apps Script auth.gs routes

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("❌ FATAL: VITE_API_URL is not set!");
}

// Generic fetch wrapper that expects your backend to return
// { success: boolean, data: ... } JSON shape.
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

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ Invalid JSON returned from API:", text);
      throw new Error("Invalid JSON response from API");
    }

    if (!data.success) {
      // Provide helpful message
      const errMsg = data.error || "API request failed";
      throw new Error(errMsg);
    }

    return data.data;
  } catch (err) {
    console.error("❌ API Error:", err);
    throw err;
  }
}

// -----------------------------
// SESSIONS API (unchanged, slightly cleaned)
// -----------------------------
export const sessionsApi = {
  async getAll(createdBy = null) {
    const all = await apiFetch(`${API_URL}?action=getAllSessions`);
    if (createdBy) return all.filter(s => s.created_by === createdBy);
    return all;
  },

  async getByCode(sessionCode) {
    return await apiFetch(`${API_URL}?action=getSessionByCode&sessionCode=${encodeURIComponent(sessionCode)}`);
  },

  async getById(sessionId) {
    return await apiFetch(`${API_URL}?action=getSessionById&sessionId=${encodeURIComponent(sessionId)}`);
  },

  async create(sessionData) {
    return await apiFetch(`${API_URL}?action=createSession`, {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
  },

  async update(sessionId, updates) {
    return await apiFetch(`${API_URL}?action=updateSession&sessionId=${encodeURIComponent(sessionId)}`, {
      method: "POST",
      body: JSON.stringify(updates),
    });
  },

  async registerParticipant(sessionId, language, participantId) {
    return await apiFetch(
      `${API_URL}?action=registerParticipant&sessionId=${encodeURIComponent(sessionId)}&language=${encodeURIComponent(language)}&participantId=${encodeURIComponent(participantId)}`,
      { method: "POST" }
    );
  }
};

// -----------------------------
// MESSAGES API
// -----------------------------
export const messagesApi = {
  async getBySession(sessionId) {
    return await apiFetch(`${API_URL}?action=getMessagesBySession&sessionId=${encodeURIComponent(sessionId)}`);
  },

  async create(messageData) {
    return await apiFetch(`${API_URL}?action=createMessage`, {
      method: "POST",
      body: JSON.stringify(messageData)
    });
  }
};

// -----------------------------
// TRANSLATION API
// -----------------------------
export const translationApi = {
  async translate(text, targetLanguage, sourceLanguage = "nl") {
    return await apiFetch(`${API_URL}?action=translateText&text=${encodeURIComponent(text)}&sourceLanguage=${encodeURIComponent(sourceLanguage)}&targetLanguage=${encodeURIComponent(targetLanguage)}`);
  },

  async translateAllMessages(sessionId, targetLanguage) {
    return await apiFetch(`${API_URL}?action=translateAllMessages&sessionId=${encodeURIComponent(sessionId)}&targetLanguage=${encodeURIComponent(targetLanguage)}`);
  },

  async getSupportedLanguages() {
    return await apiFetch(`${API_URL}?action=getSupportedLanguages`);
  }
};

// -----------------------------
// PARTICIPANT TRACKING (sessionStorage)
// -----------------------------
export const participantTracker = {
  getOrCreateParticipantId() {
    let id = sessionStorage.getItem("lvs_participant_id");
    if (!id) {
      id = `participant_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
      sessionStorage.setItem("lvs_participant_id", id);
    }
    return id;
  },

  isRegistered(sessionId) {
    return sessionStorage.getItem(`lvs_registered_${sessionId}`) === 'true';
  },

  markAsRegistered(sessionId) {
    sessionStorage.setItem(`lvs_registered_${sessionId}`, 'true');
  },

  clearSession(sessionId) {
    sessionStorage.removeItem(`lvs_registered_${sessionId}`);
  }
};

// -----------------------------
// TEACHER AUTH (via Apps Script backend)
// -----------------------------
// These call your new Apps Script endpoints added to doPost:
// - action=registerTeacher  (POST body: { fullName, email, password })
// - action=loginTeacher     (POST body: { email, password })
// - action=verifyTeacher    (POST body: { token })
// - action=logoutTeacher    (POST body: { token })
export const teacherApi = {
  async register(fullName, email, password) {
    return await apiFetch(`${API_URL}?action=registerTeacher`, {
      method: "POST",
      body: JSON.stringify({ fullName, email, password })
    });
  },

  async login(email, password) {
    return await apiFetch(`${API_URL}?action=loginTeacher`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  async verify(token) {
    return await apiFetch(`${API_URL}?action=verifyTeacher`, {
      method: "POST",
      body: JSON.stringify({ token })
    });
  },

  async logout(token) {
    return await apiFetch(`${API_URL}?action=logoutTeacher`, {
      method: "POST",
      body: JSON.stringify({ token })
    });
  }
};

// -----------------------------
// Minimal frontend auth helper
// stores only token and lightweight profile in localStorage
// -----------------------------
export const teacherAuthClient = {
  tokenKey: "lvs_teacher_token",
  profileKey: "lvs_teacher_profile",

  getToken() {
    return localStorage.getItem(this.tokenKey);
  },

  setToken(token) {
    if (token) localStorage.setItem(this.tokenKey, token);
    else localStorage.removeItem(this.tokenKey);
  },

  getProfile() {
    const raw = localStorage.getItem(this.profileKey);
    return raw ? JSON.parse(raw) : null;
  },

  setProfile(profile) {
    if (profile) localStorage.setItem(this.profileKey, JSON.stringify(profile));
    else localStorage.removeItem(this.profileKey);
  },

  // High-level login flow
  async login(email, password) {
    const res = await teacherApi.login(email, password);
    // res expected: { token, teacherId, fullName, email }
    this.setToken(res.token);
    this.setProfile({ teacherId: res.teacherId, fullName: res.fullName, email: res.email });
    return res;
  },

  async register(fullName, email, password) {
    const res = await teacherApi.register(fullName, email, password);
    // optionally auto-login after register (common UX)
    const loginRes = await teacherApi.login(email, password);
    this.setToken(loginRes.token);
    this.setProfile({ teacherId: loginRes.teacherId, fullName: loginRes.fullName, email: loginRes.email });
    return loginRes;
  },

  async verify() {
    const token = this.getToken();
    if (!token) return { valid: false };
    try {
      const res = await teacherApi.verify(token);
      if (res.valid) return { valid: true, teacherId: res.teacherId };
      this.setToken(null);
      this.setProfile(null);
      return { valid: false };
    } catch (e) {
      this.setToken(null);
      this.setProfile(null);
      return { valid: false };
    }
  },

  async logout() {
    const token = this.getToken();
    if (!token) {
      this.setProfile(null);
      return { success: true };
    }
    await teacherApi.logout(token);
    this.setToken(null);
    this.setProfile(null);
    return { success: true };
  }
};

// -----------------------------
// SESSION CODE GENERATOR (unchanged)
// -----------------------------
export function generateSessionCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "LVS";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
