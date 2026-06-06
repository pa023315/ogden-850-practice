import fs from "node:fs";
import vm from "node:vm";

const STORAGE_KEY = "english5000.srs.v1";

function makeElement(initial = {}) {
  return {
    textContent: "",
    innerHTML: "",
    value: "",
    hidden: false,
    className: "",
    dataset: {},
    children: [],
    classList: {
      add() {},
      remove() {},
      toggle() {}
    },
    addEventListener() {},
    append(child) {
      this.children.push(child);
    },
    querySelectorAll() {
      return [];
    },
    focus() {},
    ...initial
  };
}

function runAppWithState(initialState, mode = "zh-choice") {
  const storage = new Map([[STORAGE_KEY, JSON.stringify(initialState)]]);
  const elements = new Map();
  const dailyLines = [makeElement(), makeElement(), makeElement()];
  const ownSentences = [makeElement(), makeElement(), makeElement()];

  const element = (selector) => {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  };

  element("#dailyTarget").value = "20";
  element("#categoryFilter").value = "all";
  element("#modeFilter").value = mode;

  const sandbox = {
    console,
    Date,
    Math,
    setTimeout,
    clearTimeout,
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      }
    },
    document: {
      querySelector: element,
      querySelectorAll(selector) {
        if (selector === ".daily-line") return dailyLines;
        if (selector === ".own-sentence") return ownSentences;
        return [];
      },
      createElement() {
        return makeElement();
      }
    },
    location: { reload() {} },
    confirm: () => true,
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(text) {
      this.text = text;
    }
  };
  sandbox.window = sandbox;
  sandbox.window.speechSynthesis = { cancel() {}, speak() {} };

  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync("ogden-words.js", "utf8"), sandbox, { filename: "ogden-words.js" });
  vm.runInContext(fs.readFileSync("wrong-words-seed.js", "utf8"), sandbox, { filename: "wrong-words-seed.js" });
  vm.runInContext(fs.readFileSync("script.js", "utf8"), sandbox, { filename: "script.js" });

  return {
    state: JSON.parse(storage.get(STORAGE_KEY)),
    prompt: element("#promptText").textContent,
    label: element("#promptLabel").textContent,
    hint: element("#promptHint").textContent,
    dueCount: element("#dueCount").textContent,
    wrongCount: element("#wrongCount").textContent
  };
}

const staleImportedState = {
  cards: {},
  errors: [],
  learning: {},
  today: new Date().toISOString().slice(0, 10),
  daily: { done: 0, correct: 0, total: 0 },
  imports: {
    "wrong_words_2026-05-28": {
      importedAt: "2026-05-28T00:00:00.000Z",
      count: 816
    }
  }
};

const result = runAppWithState(staleImportedState);
const wrongCards = Object.values(result.state.cards).filter((card) => card.wrong > 0).length;

if (wrongCards !== 816) {
  throw new Error(`Expected 816 wrong cards to be repaired, got ${wrongCards}`);
}

if (String(result.wrongCount) !== "816") {
  throw new Error(`Expected wrongCount UI to show 816, got ${result.wrongCount}`);
}

if (String(result.dueCount) !== "816") {
  throw new Error(`Expected dueCount UI to show 816, got ${result.dueCount}`);
}

if (!result.state.cards[result.prompt] || result.state.cards[result.prompt].wrong === 0) {
  throw new Error(`Expected the first daily question to be an imported wrong word, got ${result.prompt} (${result.label})`);
}

const cleanPromptResult = runAppWithState(staleImportedState, "en-choice");

if (cleanPromptResult.label !== "") {
  throw new Error(`Expected prompt label to be empty, got ${cleanPromptResult.label}`);
}

if (cleanPromptResult.hint !== "") {
  throw new Error(`Expected English-answer hint to be empty, got ${cleanPromptResult.hint}`);
}

console.log("wrong import daily verification passed");
