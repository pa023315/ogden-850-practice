const STORAGE_KEY = "english5000.srs.v1";
const DAY_MS = 24 * 60 * 60 * 1000;

const categoryNames = {
  core: "Core 1-1000",
  common: "Common 1001-2000",
  useful: "Useful 2001-3000",
  broad: "Broad 3001-4000",
  advanced: "Advanced 4001-5000",
  op: "Operations",
  gt: "General Things",
  pt: "Picturable Things",
  qg: "General Qualities",
  qo: "Opposite Qualities"
};

const zhMap = {
  来: "來", 前: "前", 获: "獲", 得: "得", 变: "變", 给: "給", 赠: "贈", 予: "予",
  离: "離", 开: "開", 许: "許", 做: "做", 制: "製", 造: "造", 置: "置", 似: "似",
  乎: "乎", 看: "看", 起: "起", 带: "帶", 走: "走", 执: "執", 行: "行", 说: "說",
  讲: "講", 见: "見", 解: "解", 送: "送", 寄: "寄", 将: "將", 会: "會", 关: "關",
  于: "於", 大: "大", 约: "約", 穿: "穿", 过: "過", 横: "橫", 越: "越", 之: "之",
  后: "後", 反: "反", 对: "對", 靠: "靠", 着: "著", 中: "中", 站: "站", 时: "時",
  间: "間", 边: "邊", 书: "書", 写: "寫", 向: "向", 下: "下", 从: "從", 处: "處",
  灯: "燈", 飞: "飛", 飞机: "飛機", 通: "通", 门: "門", 床: "床", 一: "一", 这: "這",
  样: "樣", 个: "個", 谁: "誰", 与: "與", 为: "為", 怎: "怎", 么: "麼", 什: "什",
  钥: "鑰", 匙: "匙", 哪: "哪", 难: "難", 再: "再", 经: "經", 远: "遠", 进: "進",
  还: "還", 够: "夠", 连: "連", 几: "幾", 爱: "愛", 钱: "錢", 门: "門", 试: "試",
  盐: "鹽", 汤: "湯", 茶: "茶", 辆: "輛", 岁: "歲", 儿: "兒", 气: "氣", 动: "動",
  义: "義", 类: "類", 体: "體", 术: "術", 医: "醫", 疗: "療", 军: "軍", 队: "隊",
  务: "務", 质: "質", 实: "實", 必: "必", 须: "須", 新: "新", 正: "正", 常: "常",
  平: "平", 现: "現", 场: "場", 私: "私", 快: "快", 静: "靜", 准: "準", 备: "備",
  红: "紅", 规: "規", 律: "律", 责: "責", 负: "負", 圆: "圓", 同: "同", 严: "嚴",
  肃: "肅", 锋: "鋒", 利: "利", 光: "光", 滑: "滑", 粘: "黏", 僵: "僵", 硬: "硬",
  强: "強", 壮: "壯", 突: "突", 然: "然", 暴: "暴", 力: "力", 等: "等", 候: "候",
  温: "溫", 湿: "濕", 宽: "寬", 智: "智", 黄: "黃", 年: "年", 轻: "輕", 醒: "醒",
  坏: "壞", 弯: "彎", 曲: "曲", 蓝: "藍", 确: "確", 定: "定", 冷: "冷", 完: "完",
  整: "整", 残: "殘", 忍: "忍", 黑: "黑", 暗: "暗", 死: "死", 亲: "親", 昂: "昂",
  贵: "貴", 精: "精", 致: "緻", 不: "不", 脏: "髒", 干: "乾", 虚: "虛", 假: "假",
  弱: "弱", 女: "女", 性: "性", 愚: "愚", 蠢: "蠢", 未: "未", 绿: "綠", 病: "病",
  迟: "遲", 左: "左", 松: "鬆", 声: "聲", 混: "混", 合: "合", 狭: "狹", 窄: "窄",
  老: "老", 公: "公", 共: "共", 粗: "粗", 糙: "糙", 悲: "悲", 伤: "傷", 安: "安",
  秘: "祕", 密: "密", 简: "簡", 单: "單", 慢: "慢", 小: "小", 柔: "柔", 软: "軟",
  固: "固", 特: "特", 别: "別", 奇: "奇", 怪: "怪", 瘦: "瘦", 薄: "薄", 白: "白",
  错: "錯", 误: "誤", 广: "廣", 厅: "廳", 发: "發", 种: "種", 头: "頭", 节: "節",
  张: "張", 叶: "葉", 线: "線", 轮: "輪", 贝: "貝", 齿: "齒", 鱼: "魚", 鸟: "鳥",
  让: "讓", 拥: "擁", 们: "們", 没: "沒", 里: "裡", 当: "當", 虽: "雖", 尽: "盡",
  买: "買", 银: "銀", 铁: "鐵", 钢: "鋼", 纸: "紙", 盘: "盤", 杯: "杯", 船: "船",
  车: "車", 马: "馬", 龙: "龍", 风: "風", 云: "雲", 电: "電", 网: "網", 门: "門",
  闭: "閉", 问: "問", 闻: "聞", 语: "語", 读: "讀", 学: "學", 习: "習", 观: "觀",
  视: "視", 听: "聽", 记: "記", 录: "錄", 应: "應", 该: "該", 办: "辦", 查: "查",
  较: "較", 资: "資", 料: "料", 源: "源", 场: "場", 块: "塊", 条: "條", 只: "隻",
  张: "張", 本: "本", 双: "雙", 两: "兩", 点: "點", 号: "號", 压: "壓", 盖: "蓋",
  协: "協", 议: "議", 练: "練", 简: "簡", 繁: "繁", 词: "詞", 题: "題", 选: "選"
};

const state = loadState();
let session = [];
let currentIndex = -1;
let currentQuestion = null;
let answered = false;

const els = {
  dueCount: document.querySelector("#dueCount"),
  doneCount: document.querySelector("#doneCount"),
  accuracy: document.querySelector("#accuracy"),
  wrongCount: document.querySelector("#wrongCount"),
  questionKind: document.querySelector("#questionKind"),
  questionProgress: document.querySelector("#questionProgress"),
  promptLabel: document.querySelector("#promptLabel"),
  promptText: document.querySelector("#promptText"),
  promptHint: document.querySelector("#promptHint"),
  choiceGrid: document.querySelector("#choiceGrid"),
  blankForm: document.querySelector("#blankForm"),
  blankInput: document.querySelector("#blankInput"),
  feedback: document.querySelector("#feedback"),
  startBtn: document.querySelector("#startBtn"),
  againBtn: document.querySelector("#againBtn"),
  speakBtn: document.querySelector("#speakBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  dailyTarget: document.querySelector("#dailyTarget"),
  categoryFilter: document.querySelector("#categoryFilter"),
  modeFilter: document.querySelector("#modeFilter"),
  errorList: document.querySelector("#errorList"),
  clearErrorsBtn: document.querySelector("#clearErrorsBtn"),
  searchInput: document.querySelector("#searchInput"),
  wordList: document.querySelector("#wordList")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.cards && saved.errors) return saved;
  } catch (error) {
    console.warn("Cannot read saved progress", error);
  }
  return { cards: {}, errors: [], today: todayKey(), daily: { done: 0, correct: 0, total: 0 } };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function rollDailyState() {
  if (state.today !== todayKey()) {
    state.today = todayKey();
    state.daily = { done: 0, correct: 0, total: 0 };
    saveState();
  }
}

function getCard(word) {
  if (!state.cards[word.w]) {
    state.cards[word.w] = {
      due: startOfToday(),
      interval: 0,
      ease: 2.5,
      reps: 0,
      lapses: 0,
      correct: 0,
      wrong: 0,
      last: null
    };
  }
  return state.cards[word.w];
}

function t(text) {
  return String(text || "").replace(/[^\x00-\x7F]/g, (char) => zhMap[char] || char);
}

function clean(text) {
  return String(text || "").trim().toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:]/g, "");
}

function filteredWords() {
  const cat = els.categoryFilter.value;
  return cat === "all" ? OGDEN_WORDS : OGDEN_WORDS.filter((word) => word.c === cat);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickSession() {
  rollDailyState();
  const words = filteredWords();
  const now = Date.now();
  const target = Math.max(5, Math.min(80, Number(els.dailyTarget.value) || 20));
  const due = words
    .filter((word) => getCard(word).due <= now)
    .sort((a, b) => getCard(a).due - getCard(b).due || getCard(b).wrong - getCard(a).wrong);
  const newWords = shuffle(words.filter((word) => getCard(word).reps === 0 && !due.includes(word)));
  const extra = shuffle(words.filter((word) => !due.includes(word) && getCard(word).reps > 0));
  return [...due, ...newWords, ...extra].slice(0, target);
}

function getQuestionType() {
  const mode = els.modeFilter.value;
  if (mode !== "mixed") return mode;
  return ["zh-choice", "en-choice", "blank"][Math.floor(Math.random() * 3)];
}

function makeOptions(word, type) {
  const pool = shuffle(filteredWords().filter((item) => item.w !== word.w)).slice(0, 3);
  const options = [word, ...pool];
  return shuffle(options).map((item) => ({
    word: item,
    label: type === "zh-choice" ? t(item.zh) : item.w,
    correct: item.w === word.w
  }));
}

function makeBlankSentence(word) {
  const escaped = word.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");
  if (pattern.test(word.ex)) {
    return word.ex.replace(pattern, "_____");
  }
  return `_____  (${t(word.zh)})`;
}

function makeQuestion(word) {
  const type = getQuestionType();
  if (type === "zh-choice") {
    return {
      type,
      word,
      label: "選中文翻譯",
      prompt: word.w,
      hint: OGDEN_IPA[word.w]?.us || word.en,
      options: makeOptions(word, type)
    };
  }
  if (type === "en-choice") {
    return {
      type,
      word,
      label: "選英文翻譯",
      prompt: t(word.zh),
      hint: word.w,
      options: makeOptions(word, type)
    };
  }
  return {
    type,
    word,
    label: "選單字填空",
    prompt: makeBlankSentence(word),
    hint: t(word.exz),
    answer: word.w,
    options: makeOptions(word, type)
  };
}

function answerLabel(question) {
  if (question.type === "zh-choice") return t(question.word.zh);
  return question.word.w;
}

function renderQuestion() {
  answered = false;
  currentQuestion = makeQuestion(session[currentIndex]);
  els.questionKind.textContent = currentQuestion.label;
  els.questionProgress.textContent = `${currentIndex + 1} / ${session.length}`;
  els.promptLabel.textContent = `${categoryNames[currentQuestion.word.c]} · ${currentQuestion.word.en}`;
  els.promptText.textContent = currentQuestion.prompt;
  els.promptHint.textContent = currentQuestion.hint;
  els.feedback.hidden = true;
  els.feedback.className = "feedback";
  els.againBtn.hidden = true;
  els.startBtn.hidden = true;
  els.choiceGrid.innerHTML = "";
  els.blankInput.value = "";

  els.blankForm.hidden = true;
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", () => answerQuestion(option.correct, option.label));
    els.choiceGrid.append(button);
  });
}

function answerQuestion(isCorrect, response) {
  if (answered) return;
  answered = true;
  const word = currentQuestion.word;
  const card = getCard(word);
  const now = Date.now();

  state.daily.done += 1;
  state.daily.total += 1;
  if (isCorrect) {
    state.daily.correct += 1;
    card.correct += 1;
    card.reps += 1;
    card.interval = nextInterval(card);
    card.ease = Math.min(3.2, card.ease + 0.08);
  } else {
    card.wrong += 1;
    card.lapses += 1;
    card.interval = 1;
    card.ease = Math.max(1.4, card.ease - 0.2);
    state.errors.unshift({
      word: word.w,
      zh: word.zh,
      en: word.en,
      type: currentQuestion.label,
      response,
      answer: answerLabel(currentQuestion),
      at: new Date().toISOString()
    });
    state.errors = state.errors.slice(0, 80);
  }

  card.due = now + card.interval * DAY_MS;
  card.last = now;
  saveState();
  showFeedback(isCorrect);
  renderStats();
}

function nextInterval(card) {
  if (card.reps <= 1) return 1;
  if (card.reps === 2) return 3;
  return Math.max(4, Math.round(card.interval * card.ease));
}

function showFeedback(isCorrect) {
  const word = currentQuestion.word;
  els.feedback.hidden = false;
  els.feedback.classList.toggle("is-correct", isCorrect);
  els.feedback.classList.toggle("is-wrong", !isCorrect);
  els.feedback.innerHTML = `
    <strong>${isCorrect ? "答對" : "再記一次"} · ${word.w}</strong>
    <span>${t(word.zh)} · ${word.en}</span>
    <small>${word.ex} / ${t(word.exz)}</small>
  `;

  [...els.choiceGrid.querySelectorAll("button")].forEach((button) => {
    button.disabled = true;
    const isAnswer = button.textContent === answerLabel(currentQuestion);
    button.classList.toggle("is-answer", isAnswer);
  });
  els.blankForm.hidden = true;
  els.againBtn.hidden = false;
}

function submitBlank(event) {
  event.preventDefault();
  const response = els.blankInput.value;
  answerQuestion(clean(response) === clean(currentQuestion.answer), response || "空白");
}

function nextQuestion() {
  if (currentIndex + 1 >= session.length) {
    els.promptLabel.textContent = "今日完成";
    els.promptText.textContent = "這輪練習結束";
    els.promptHint.textContent = "明天會優先排出今天答錯與到期的單字。";
    els.choiceGrid.innerHTML = "";
    els.blankForm.hidden = true;
    els.feedback.hidden = true;
    els.againBtn.hidden = true;
    els.startBtn.hidden = false;
    els.startBtn.textContent = "再開一輪";
    return;
  }
  currentIndex += 1;
  renderQuestion();
}

function startPractice() {
  session = pickSession();
  currentIndex = 0;
  if (!session.length) return;
  renderQuestion();
  renderStats();
}

function renderStats() {
  rollDailyState();
  const words = filteredWords();
  const now = Date.now();
  const cards = words.map(getCard);
  const due = words.filter((word) => getCard(word).due <= now).length;
  const wrong = cards.filter((card) => card.wrong > 0).length;
  const acc = state.daily.total ? Math.round((state.daily.correct / state.daily.total) * 100) : 0;
  els.dueCount.textContent = due;
  els.doneCount.textContent = state.daily.done;
  els.accuracy.textContent = `${acc}%`;
  els.wrongCount.textContent = wrong;
  renderErrors();
  renderWordList();
}

function renderErrors() {
  const errors = state.errors.slice(0, 12);
  if (!errors.length) {
    els.errorList.innerHTML = `<p class="empty">尚無錯誤紀錄</p>`;
    return;
  }
  els.errorList.innerHTML = errors.map((error) => `
    <article>
      <strong>${error.word}</strong>
      <span>${t(error.zh)} · ${error.en}</span>
      <small>${error.type} · 你的答案：${escapeHtml(error.response)}</small>
    </article>
  `).join("");
}

function renderWordList() {
  const q = clean(els.searchInput.value);
  const words = filteredWords().filter((word) => {
    if (!q) return true;
    return clean(word.w).includes(q) || clean(t(word.zh)).includes(q) || clean(word.en).includes(q);
  }).slice(0, 80);

  els.wordList.innerHTML = words.map((word) => {
    const card = getCard(word);
    const due = Math.max(0, Math.ceil((card.due - Date.now()) / DAY_MS));
    return `
      <button type="button" data-word="${word.w}">
        <strong>${word.w}</strong>
        <span>${t(word.zh)}</span>
        <small>${card.reps ? `${due} 天後 · ${card.correct}/${card.wrong}` : "新詞"}</small>
      </button>
    `;
  }).join("");
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function speakCurrent() {
  const text = currentQuestion?.word?.w || "English vocabulary";
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

function resetProgress() {
  if (!confirm("確定要清除所有練習進度？")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function clearErrors() {
  state.errors = [];
  Object.values(state.cards).forEach((card) => {
    card.wrong = 0;
    card.lapses = 0;
  });
  saveState();
  renderStats();
}

els.startBtn.addEventListener("click", startPractice);
els.againBtn.addEventListener("click", nextQuestion);
els.blankForm.addEventListener("submit", submitBlank);
els.speakBtn.addEventListener("click", speakCurrent);
els.resetBtn.addEventListener("click", resetProgress);
els.clearErrorsBtn.addEventListener("click", clearErrors);
els.searchInput.addEventListener("input", renderWordList);
els.categoryFilter.addEventListener("change", renderStats);
els.modeFilter.addEventListener("change", () => {
  if (session.length && !answered) renderQuestion();
});
els.dailyTarget.addEventListener("change", renderStats);
els.wordList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-word]");
  if (!button) return;
  const word = OGDEN_WORDS.find((item) => item.w === button.dataset.word);
  session = [word];
  currentIndex = 0;
  renderQuestion();
});

rollDailyState();
renderStats();
startPractice();
