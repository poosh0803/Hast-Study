// Registry of Read content sets. Add a new set:
//   1. Create content/read/sets-<id>.js exporting a set object.
//   2. Import it below and add it to READ_SETS.
// Nothing outside this file (and the new set file) needs to change —
// app/read/page.js just reads READ_SETS.

export const READ_SETS = [];
