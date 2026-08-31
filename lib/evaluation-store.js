import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const EVALUATIONS_FILE = path.join(DATA_DIR, "evaluations.json");

// Deliberately separate from progress-store.js's data/progress.json —
// that file's `answers` map is relied on elsewhere (SetList's "X / Y
// correct" badge, QuizSet's restored answers) to only ever contain real
// in-app answers with chosen/correct/answeredAt. Mixing evaluation-only
// entries into it would silently corrupt those.
function readStore() {
  try {
    return JSON.parse(fs.readFileSync(EVALUATIONS_FILE, "utf8"));
  } catch {
    return { batches: [], subjects: {} };
  }
}

function writeStore(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(EVALUATIONS_FILE, JSON.stringify(store, null, 2), "utf8");
}

// Merges a re-imported export file's `evaluation` fields in. `subjects` is
// the same shape the export produces: { [subject]: [{ id, questions: [{
// id, evaluation }], evaluation }] } — a quiz set carries per-question
// evaluations, a Write prompt (no `questions`) carries one `evaluation`
// for the whole piece instead, stored under the reserved key "_set" since
// question ids never collide with it. Returns counts so the caller can
// report what actually landed (a file with every `evaluation` left blank
// imports nothing, which is worth telling the user).
export function importEvaluations({ overallEvaluation, subjects }) {
  const store = readStore();
  let overallSaved = false;
  let entryCount = 0;
  const importedAt = new Date().toISOString();

  if (overallEvaluation) {
    store.batches.push({ importedAt, text: overallEvaluation });
    overallSaved = true;
  }

  for (const [subject, sets] of Object.entries(subjects || {})) {
    for (const set of sets) {
      if (Array.isArray(set.questions)) {
        for (const q of set.questions) {
          const text = typeof q.evaluation === "string" ? q.evaluation.trim() : "";
          if (!text) continue;

          if (!store.subjects[subject]) store.subjects[subject] = {};
          if (!store.subjects[subject][set.id]) store.subjects[subject][set.id] = {};
          store.subjects[subject][set.id][q.id] = { evaluation: text, importedAt };
          entryCount += 1;
        }
        continue;
      }

      const text = typeof set.evaluation === "string" ? set.evaluation.trim() : "";
      if (!text) continue;

      if (!store.subjects[subject]) store.subjects[subject] = {};
      if (!store.subjects[subject][set.id]) store.subjects[subject][set.id] = {};
      store.subjects[subject][set.id]._set = { evaluation: text, importedAt };
      entryCount += 1;
    }
  }

  writeStore(store);
  return { overallSaved, questionCount: entryCount };
}

// One subject's imported evaluations: { [setId]: { [questionId]: {
// evaluation, importedAt } } } — a Write prompt's whole-piece evaluation
// sits under the "_set" key.
export function getSubjectEvaluations(subject) {
  const store = readStore();
  return store.subjects[subject] || {};
}

// One set's imported evaluations: { [questionId]: { evaluation,
// importedAt } } (or just `{ _set: {...} }` for a Write prompt). Used by
// a set's detail page to show notes inline next to the question/draft.
export function getSetEvaluations(subject, setId) {
  const store = readStore();
  return store.subjects[subject]?.[setId] || {};
}

// Everything — every overall batch note, and every subject's per-set
// evaluations. Used by app/evaluations/page.js.
export function getAllEvaluations() {
  return readStore();
}
