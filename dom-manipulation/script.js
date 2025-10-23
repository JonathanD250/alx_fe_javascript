// Step 0: Initialize default quotes
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

// Step 1: Load quotes and last filter on page load
window.onload = function () {
  loadQuotes(); // Load quotes from localStorage if available
  populateCategories(); // Populate category dropdown
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  document.getElementById("categoryFilter").value = lastFilter;
  filterQuotes(); // Apply last selected filter
};

// Step 2: Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Step 3: Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Step 4: Populate unique categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Step 5: Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  displayFilteredQuotes(filteredQuotes);
}

// Step 6: Display filtered quotes
function displayFilteredQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes found for this category.";
    return;
  }

  let html = "";
  filteredQuotes.forEach(q => {
    html += `<p>"${q.text}" - <em>${q.category}</em></p>`;
  });

  quoteDisplay.innerHTML = html;
}

// Step 7: Add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Step 8: Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Step 9: Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading the file. Please check the content.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Step 10: Remember last viewed quote using sessionStorage
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Display last viewed quote on page load (if any)
window.addEventListener("load", () => {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `"${q.text}" - <em>${q.category}</em>`;
  }
});

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Step 11: Simulate server syncing using JSONPlaceholder

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Simulate fetching updated quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate extracting quotes (limit to 5 fake posts)
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    handleServerSync(serverQuotes);
  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
}

// Simulate sending local quotes to server
async function sendQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quotes),
      headers: { "Content-Type": "application/json" }
    });
    console.log("Quotes synced with server.");
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}

// Step 12: Merge server data with local data
function handleServerSync(serverQuotes) {
  let conflictFound = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(q => q.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      conflictFound = true;
    }
  });

  if (conflictFound) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification("New quotes synced from server.");
  }
}

// Step 13: Show notification for sync updates
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "10px";
  notification.style.right = "10px";
  notification.style.backgroundColor = "#333";
  notification.style.color = "#fff";
  notification.style.padding = "10px 15px";
  notification.style.borderRadius = "8px";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Periodic sync every 30 seconds
setInterval(() => {
  fetchQuotesFromServer();
  sendQuotesToServer();
}, 30000);

function manualSync() {
  fetchQuotesFromServer();
  sendQuotesToServer();
  showNotification("Manual sync complete.");
}
