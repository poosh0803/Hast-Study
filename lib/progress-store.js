import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const PROGRESS_FILE = path.join(DATA_DIR, "progress.json");

// Single JSON file, nested by subject then set id — not committed to git
// (see .gitignore), this is runtime state, not authored content. Fine for
// one user at this scale: no locking, read-modify-write on every call.
function readStore() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeStore(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(store, null, 2), "utf8");
}

// One set's saved progress: { answers: { [questionId]: { chosen, correct,
// answeredAt } }, updatedAt } — or null if nothing saved for it yet.
export function getSetProgress(subject, setId) {
  const store = readStore();
  return store[subject]?.[setId] || null;
}

// Every saved set's progress for one subject: { [setId]: {...} }.
export function getSubjectProgress(subject) {
  const store = readStore();
  return store[subject] || {};
}

export function recordAnswer({ subject, setId, questionId, chosen, correct }) {
  const store = readStore();
  if (!store[subject]) store[subject] = {};
  if (!store[subject][setId]) store[subject][setId] = { answers: {} };

  store[subject][setId].answers[questionId] = {
    chosen,
    correct,
    answeredAt: new Date().toISOString(),
  };
  store[subject][setId].updatedAt = new Date().toISOString();

  writeStore(store);
  return store[subject][setId];
}

export function resetSetProgress(subject, setId) {
  const store = readStore();
  if (store[subject]?.[setId]) {
    delete store[subject][setId];
    writeStore(store);
  }
}
