import fs from "node:fs";

const sourceCsv = "sources/ecdict.csv";
const wrongMd = "/Users/ian/Downloads/Codex/wrong_words_2026-05-28.md";
const outputJs = "wrong-words-seed.js";
const outputJson = "data/wrong_words_2026-05-28.json";
const importId = "wrong_words_2026-05-28";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function stripMarkup(text) {
  return String(text || "")
    .replace(/\[网络\][\s\S]*/g, "")
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstChineseDefinition(text) {
  return stripMarkup(text)
    .split(/\n|\\n|；|;|\//)
    .map((part) => part.replace(/^([a-z]+\.|[a-z. ]+& [a-z. ]+\.)\s*/i, "").trim())
    .find((part) => /[\u4e00-\u9fff]/.test(part)) || "";
}

function firstEnglishDefinition(text) {
  return stripMarkup(text)
    .split(/\n|\\n|;|\//)
    .map((part) => part.replace(/^([a-z]+\.|[a-z. ]+& [a-z. ]+\.)\s*/i, "").trim())
    .find((part) => /^[A-Za-z]/.test(part)) || "";
}

function primaryPos(text) {
  const raw = String(text || "").toLowerCase();
  if (/\bart\b|article/.test(raw)) return "art";
  if (/\badv\b/.test(raw)) return "adv";
  if (/\badj\b|a\./.test(raw)) return "adj";
  if (/\bvt\b|\bvi\b|\bv\b|v\./.test(raw)) return "v";
  if (/\bprep\b/.test(raw)) return "prep";
  if (/\bpron\b/.test(raw)) return "pron";
  if (/\bconj\b/.test(raw)) return "conj";
  if (/\bn\b|n\./.test(raw)) return "n";
  return "n";
}

function readWrongWords(md) {
  const high = [];
  const low = [];
  let section = "";
  for (const line of md.split(/\r?\n/)) {
    if (/錯 3 次以上/.test(line)) section = "high";
    else if (/錯 1~2 次/.test(line)) section = "low";
    else {
      const match = line.match(/^\s*-\s+(.+?)\s*$/);
      if (!match) continue;
      const word = match[1].trim().toLowerCase();
      if (section === "high") high.push(word);
      if (section === "low") low.push(word);
    }
  }
  return [
    ...high.map((word) => ({ word, wrongCount: 3, bucket: "3+" })),
    ...low.map((word) => ({ word, wrongCount: 2, bucket: "1-2" }))
  ];
}

const csv = fs.readFileSync(sourceCsv, "utf8");
const [header, ...records] = parseCsv(csv);
const columns = Object.fromEntries(header.map((name, index) => [name, index]));
const dict = new Map();

for (const row of records) {
  const word = String(row[columns.word] || "").trim().toLowerCase();
  if (!word || dict.has(word)) continue;
  const zh = firstChineseDefinition(row[columns.translation]);
  const en = firstEnglishDefinition(row[columns.definition]) || zh || word;
  dict.set(word, {
    w: word,
    c: "wrong",
    zh: zh || word,
    en,
    ex: `Meaning: ${en}.`,
    exz: zh || word,
    s: [],
    r: 5001,
    p: primaryPos(row[columns.pos] || row[columns.translation] || row[columns.definition]),
    seedWrong: true
  });
}

const seed = readWrongWords(fs.readFileSync(wrongMd, "utf8"));
const extras = seed
  .map((item) => dict.get(item.word))
  .filter(Boolean);
const unresolved = seed.filter((item) => !dict.has(item.word)).map((item) => item.word);

const payload = {
  importId,
  source: wrongMd,
  importedAt: "2026-05-28",
  seed,
  extras,
  unresolved
};

fs.writeFileSync(outputJs, `window.WRONG_WORD_IMPORT = ${JSON.stringify(payload)};\n`);
fs.writeFileSync(outputJson, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`wrong words: ${seed.length}`);
console.log(`extras from ECDICT: ${extras.length}`);
console.log(`unresolved: ${unresolved.length}`);
if (unresolved.length) console.log(unresolved.join("\n"));
