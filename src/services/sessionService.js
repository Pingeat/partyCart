const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      id: userId,
      createdAt: new Date().toISOString(),
      transcript: [],
      preferences: {}
    });
  }
  return sessions.get(userId);
}

function appendTranscript(userId, role, text) {
  const session = getSession(userId);
  session.transcript.push({ role, text, at: new Date().toISOString() });
  return session;
}

function updatePreferences(userId, key, value) {
  const session = getSession(userId);
  session.preferences[key] = value;
  return session;
}

module.exports = {
  getSession,
  appendTranscript,
  updatePreferences
};
