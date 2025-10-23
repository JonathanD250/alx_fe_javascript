// Step 1: Initialize quotes
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

// Step 2: Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Step 3: Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
}

// Step 4: Add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both fields.");
    return;
    }
    
  // Add to the quotes array
  quotes.push({ text: quoteText, category: quoteCategory });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Confirm addition
  quoteDisplay.innerHTML = `New quote added: "${quoteText}" - <em>${quoteCategory}</em>`;
}

// Step 5: Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
