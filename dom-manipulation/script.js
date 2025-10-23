// quotes initial list
let quotes = [
  { text: "Knowledge speaks, but wisdom listens.", category: "Wisdom" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Action is the foundational key to all success.", category: "Success" },
  { text: "Discipline is the bridge between goals and achievement.", category: "Discipline" },
  { text: "The future belongs to those who prepare for it today.", category: "Preparation" },
  { text: "Courage is not the absence of fear, but the triumph over it.", category: "Courage" },
  { text: "Small daily improvements lead to lasting results.", category: "Growth" },
  { text: "Success is not in what you have, but who you become.", category: "Character" },
  { text: "The only limit to your impact is your imagination and commitment.", category: "Leadership" },
  { text: "Learning never exhausts the mind.", category: "Knowledge" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const importFileInput = document.getElementById("importFile");

// storage keys
const LS_KEY = "dynamicQuotes_v1";
const SESSION_LAST_INDEX = "lastViewedQuoteIndex";

// load quotes from localStorage if present
function loadQuotes() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(q => q.text && q.category)) {
      quotes = parsed;
    }
  } catch (e) {
    console.warn("Failed to parse stored quotes", e);
  }
}

// save quotes to localStorage
function saveQuotes() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.warn("Failed to save quotes", e);
  }
}

// show a random quote and store index in sessionStorage
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${q.text}" - <em>${q.category}</em>`;
  try {
    sessionStorage.setItem(SESSION_LAST_INDEX, String(randomIndex));
  } catch (e) {
    // ignore sessionStorage errors
  }
}

// create the add-quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// add a quote, update storage, and refresh display message
function addQuote() {
  const quoteTextEl = document.getElementById("newQuoteText");
  const quoteCategoryEl = document.getElementById("newQuoteCategory");
  if (!quoteTextEl || !quoteCategoryEl) {
    alert("Form inputs missing");
    return;
  }

  const quoteText = quoteTextEl.value.trim();
  const quoteCategory = quoteCategoryEl.value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  quoteTextEl.value = "";
  quoteCategoryEl.value = "";

  saveQuotes();

  quoteDisplay.innerHTML = `New quote added: "${quoteText}" - <em>${quoteCategory}</em>`;
}

// export quotes to a JSON file
function exportToJson() {
  const payload = JSON.stringify(quotes, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = "quotes_export.json";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// import quotes from a selected JSON file
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        alert("Imported file must contain an array of quote objects");
        return;
      }
      const valid = parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (valid.length === 0) {
        alert("No valid quotes found in file");
        return;
      }
      // prevent duplicates by simple text+category check
      const existingSet = new Set(quotes.map(q => q.text + "||" + q.category));
      valid.forEach(q => {
        const key = q.text + "||" + q.category;
        if (!existingSet.has(key)) {
          quotes.push({ text: q.text, category: q.category });
          existingSet.add(key);
        }
      });
      saveQuotes();
      alert("Quotes imported successfully");
    } catch (err) {
      alert("Failed to import JSON file");
      console.warn(err);
    } finally {
      // reset input so same file can be reselected if needed
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

// show last viewed quote if present in sessionStorage
function restoreLastViewed() {
  try {
    const idx = sessionStorage.getItem(SESSION_LAST_INDEX);
    if (idx !== null) {
      const i = Number(idx);
      if (!Number.isNaN(i) && quotes[i]) {
        const q = quotes[i];
        quoteDisplay.innerHTML = `"${q.text}" - <em>${q.category}</em>`;
      }
    }
  } catch (e) {
    // ignore session errors
  }
}

// init sequence
function init() {
  loadQuotes();
  createAddQuoteForm();
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", showRandomQuote);
  }
  if (exportBtn) {
    exportBtn.addEventListener("click", exportToJson);
  }
  if (importFileInput) {
    importFileInput.addEventListener("change", importFromJsonFile);
  }
  restoreLastViewed();
  saveQuotes(); // ensure initial list persists if localStorage empty
}

init();
