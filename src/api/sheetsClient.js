// src/api/sheetsClient.js
// API Client voor Google Apps Script backend

const API_URL = import.meta.env.VITE_API_URL || '';

// Helper: Fetch wrapper met error handling
async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========================================
// SESSIONS API
// ========================================

export const sessionsApi = {
  // Haal alle sessies op (voor leerkracht dashboard)
  async getAll(createdBy = null) {
    const allSessions = await apiFetch(`${API_URL}?action=getAllSessions`);
    
    if (createdBy) {
      return allSessions.filter(s => s.created_by === createdBy);
    }
    
    return allSessions;
  },

  // Haal sessie op via session_code (voor ouders)
  async getByCode(sessionCode) {
    return await apiFetch(`${API_URL}?action=getSessionByCode&sessionCode=${encodeURIComponent(sessionCode)}`);
  },

  // Haal sessie op via ID
  async getById(sessionId) {
    return await apiFetch(`${API_URL}?action=getSessionById&sessionId=${encodeURIComponent(sessionId)}`);
  },

  // Maak nieuwe sessie aan
  async create(sessionData) {
    return await apiFetch(`${API_URL}?action=createSession`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Update bestaande sessie
  async update(sessionId, updates) {
    return await apiFetch(`${API_URL}?action=updateSession&sessionId=${encodeURIComponent(sessionId)}`, {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  },

  // Registreer participant (AVG-vriendelijk)
  async registerParticipant(sessionId, language, participantId) {
    return await apiFetch(
      `${API_URL}?action=registerParticipant&sessionId=${encodeURIComponent(sessionId)}&language=${encodeURIComponent(language)}&participantId=${encodeURIComponent(participantId)}`,
      { method: 'POST' }
    );
  },
};

// ========================================
// MESSAGES API
// ========================================

export const messagesApi = {
  // Haal alle messages voor een sessie op
  async getBySession(sessionId) {
    return await apiFetch(`${API_URL}?action=getMessagesBySession&sessionId=${encodeURIComponent(sessionId)}`);
  },

  // Maak nieuw bericht aan (alleen origineel)
  async create(messageData) {
    return await apiFetch(`${API_URL}?action=createMessage`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// ========================================
// TRANSLATION API
// ========================================

export const translationApi = {
  // Vertaal enkele tekst on-demand
  async translate(text, targetLanguage, sourceLanguage = 'nl') {
    return await apiFetch(
      `${API_URL}?action=translateText&text=${encodeURIComponent(text)}&sourceLanguage=${sourceLanguage}&targetLanguage=${targetLanguage}`
    );
  },

  // Vertaal alle berichten voor transcript
  async translateAllMessages(sessionId, targetLanguage) {
    return await apiFetch(
      `${API_URL}?action=translateAllMessages&sessionId=${encodeURIComponent(sessionId)}&targetLanguage=${targetLanguage}`
    );
  },

  // Haal ondersteunde talen op
  async getSupportedLanguages() {
    return await apiFetch(`${API_URL}?action=getSupportedLanguages`);
  },
};

// ========================================
// PARTICIPANT TRACKING (sessionStorage)
// ========================================

export const participantTracker = {
  // Genereer unieke participant ID (blijft in sessionStorage)
  getOrCreateParticipantId() {
    let participantId = sessionStorage.getItem('lvs_participant_id');
    
    if (!participantId) {
      participantId = `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('lvs_participant_id', participantId);
    }
    
    return participantId;
  },

  // Check of deze participant al geregistreerd is voor deze sessie
  isRegistered(sessionId) {
    return sessionStorage.getItem(`lvs_registered_${sessionId}`) === 'true';
  },

  // Markeer als geregistreerd
  markAsRegistered(sessionId) {
    sessionStorage.setItem(`lvs_registered_${sessionId}`, 'true');
  },

  // Clear na sessie beëindigen
  clearSession(sessionId) {
    sessionStorage.removeItem(`lvs_registered_${sessionId}`);
  },
};

// ========================================
// TEACHER AUTH (localStorage)
// ========================================

export const teacherAuth = {
  // Login leerkracht
  login(email, password) {
    const teachers = JSON.parse(localStorage.getItem('lvs_teachers') || '{}');
    
    if (teachers[email] && teachers[email].password === password) {
      const teacherData = {
        email: email,
        fullName: teachers[email].fullName,
      };
      localStorage.setItem('lvs_teacher', JSON.stringify(teacherData));
      return teacherData;
    }
    
    return null;
  },

  // Registreer leerkracht
  register(fullName, email, password) {
    const teachers = JSON.parse(localStorage.getItem('lvs_teachers') || '{}');
    
    if (teachers[email]) {
      throw new Error('Dit e-mailadres is al geregistreerd');
    }
    
    teachers[email] = { fullName, password };
    localStorage.setItem('lvs_teachers', JSON.stringify(teachers));
    
    const teacherData = { email, fullName };
    localStorage.setItem('lvs_teacher', JSON.stringify(teacherData));
    
    return teacherData;
  },

  // Haal huidige leerkracht op
  getCurrentTeacher() {
    const data = localStorage.getItem('lvs_teacher');
    return data ? JSON.parse(data) : null;
  },

  // Logout
  logout() {
    localStorage.removeItem('lvs_teacher');
  },
};

// ========================================
// SESSION CODE GENERATOR
// ========================================

export function generateSessionCode() {
  // Genereer code zonder O, 0, I, L om verwarring te voorkomen
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = 'LVS';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}
