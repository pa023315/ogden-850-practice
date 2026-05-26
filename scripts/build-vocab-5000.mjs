import fs from "node:fs";

const sourcePath = "sources/ecdict.csv";
const outputPath = "ogden-words.js";
const metaPath = "data/vocab-5000.json";

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

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
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
  const cleaned = stripMarkup(text)
    .split(/\n|\\n|；|;|\//)
    .map((part) => part.replace(/^([a-z]+\.|[a-z. ]+& [a-z. ]+\.)\s*/i, "").trim())
    .find((part) => /[\u4e00-\u9fff]/.test(part));
  return cleaned || "";
}

function firstEnglishDefinition(text) {
  const cleaned = stripMarkup(text)
    .split(/\n|\\n|;|\//)
    .map((part) => part.replace(/^([a-z]+\.|[a-z. ]+& [a-z. ]+\.)\s*/i, "").trim())
    .find((part) => /^[A-Za-z]/.test(part));
  return cleaned || "";
}

function isGoodWord(word) {
  return /^[a-z][a-z-]{1,24}$/.test(word) && !word.includes("--") && !word.endsWith("-");
}

function levelForRank(rank) {
  if (rank <= 1000) return "core";
  if (rank <= 2000) return "common";
  if (rank <= 3000) return "useful";
  if (rank <= 4000) return "broad";
  return "advanced";
}

const csv = fs.readFileSync(sourcePath, "utf8");
const [header, ...records] = parseCsv(csv);
const columns = Object.fromEntries(header.map((name, index) => [name, index]));
const seen = new Set();
const entries = [];

for (const row of records) {
  const word = String(row[columns.word] || "").trim().toLowerCase();
  if (!isGoodWord(word) || seen.has(word)) continue;

  const zh = firstChineseDefinition(row[columns.translation]);
  const en = firstEnglishDefinition(row[columns.definition]);
  const phonetic = String(row[columns.phonetic] || "").trim();
  const bnc = Number(row[columns.bnc]) || 0;
  const frq = Number(row[columns.frq]) || 0;
  const oxford = Number(row[columns.oxford]) || 0;
  const collins = Number(row[columns.collins]) || 0;

  if (!zh || !en) continue;
  if (!bnc && !frq && !oxford && !collins) continue;

  seen.add(word);
  entries.push({ word, zh, en, phonetic, bnc, frq, oxford, collins });
}

entries.sort((a, b) => {
  const aScore = (a.oxford ? -200000 : 0) + (a.collins ? -100000 : 0) + (a.bnc || 999999) + (a.frq || 999999);
  const bScore = (b.oxford ? -200000 : 0) + (b.collins ? -100000 : 0) + (b.bnc || 999999) + (b.frq || 999999);
  return aScore - bScore || a.word.localeCompare(b.word);
});

const selected = entries.slice(0, 5000).map((entry, index) => {
  const rank = index + 1;
  return {
    w: entry.word,
    c: levelForRank(rank),
    zh: entry.zh,
    en: entry.en,
    ex: `Meaning: ${entry.en}.`,
    exz: entry.zh,
    s: [],
    r: rank
  };
});

const ipa = Object.fromEntries(selected.map((entry) => {
  const source = entries.find((item) => item.word === entry.w);
  const phonetic = source?.phonetic ? `/${source.phonetic.replace(/^\/|\/$/g, "")}/` : "";
  return [entry.w, { uk: phonetic, us: phonetic }];
}));

fs.writeFileSync(outputPath, `const OGDEN_WORDS = ${JSON.stringify(selected)};\nconst OGDEN_IPA = ${JSON.stringify(ipa)};\n`);
fs.writeFileSync(metaPath, `${JSON.stringify({ source: "ECDICT", count: selected.length, generatedAt: new Date().toISOString(), words: selected }, null, 2)}\n`);
console.log(`Generated ${selected.length} words`);
