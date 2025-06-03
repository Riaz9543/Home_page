// Update date and time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}

// Initialize and update every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Handle search
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const suggestionsDiv = document.getElementById('suggestions');
let debounceTimer;

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}

// Programming quotes
const quotes = [{
  text: "The best error message is the one that never shows up.",
  author: "Thomas Fuchs"
},
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Programming is the art of telling another human what one wants the computer to do.",
    author: "Donald Knuth"
  },
  {
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie"
  },
  {
    text: "Clean code always looks like it was written by someone who cares.",
    author: "Robert C. Martin"
  },
  {
    text: "The most disastrous thing that you can ever learn is your first programming language.",
    author: "Alan Kay"
  }];

// Set random quote on page load
window.addEventListener('DOMContentLoaded', () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quote-text').textContent = `"${randomQuote.text}"`;
  document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
});

// Idea Saving Functionality
const ideaInput = document.getElementById('idea-input');
const saveIdeaBtn = document.getElementById('save-idea-btn');
const ideasContainer = document.getElementById('ideas-container');

// Load saved ideas from localStorage
let savedIdeas = JSON.parse(localStorage.getItem('programmerIdeas')) || [];

// Display saved ideas
function displayIdeas() {
  ideasContainer.innerHTML = '';

  if (savedIdeas.length === 0) {
    ideasContainer.innerHTML = `
    <div class="idea-card" style="text-align:center; background:rgba(148, 163, 184, 0.1);">
    <p>No ideas saved yet. Capture your first idea above!</p>
    </div>
    `;
    return;
  }

  savedIdeas.forEach((idea, index) => {
    const ideaElement = document.createElement('div');
    ideaElement.className = 'idea-card';
    ideaElement.innerHTML = `
    <button class="delete-btn" onclick="deleteIdea(${index})">
    <i class="fas fa-trash"></i>
    </button>
    <p>${idea.text}</p>
    <div class="timestamp">Saved on: ${idea.date}</div>
    `;
    ideasContainer.appendChild(ideaElement);
  });
}

// Save a new idea
saveIdeaBtn.addEventListener('click', () => {
  const ideaText = ideaInput.value.trim();

  if (ideaText) {
    const now = new Date();
    const dateString = now.toLocaleString();

    const newIdea = {
      text: ideaText,
      date: dateString
    };

    savedIdeas.unshift(newIdea);
    localStorage.setItem('programmerIdeas', JSON.stringify(savedIdeas));

    ideaInput.value = '';
    displayIdeas();

    // Show visual feedback
    saveIdeaBtn.innerHTML = '<i class="fas fa-check"></i> Idea Saved!';
    setTimeout(() => {
      saveIdeaBtn.innerHTML = '<i class="fas fa-save"></i> Save Idea';
    }, 2000);
  }
});

// Delete an idea
window.deleteIdea = function(index) {
  savedIdeas.splice(index,
    1);
  localStorage.setItem('programmerIdeas',
    JSON.stringify(savedIdeas));
  displayIdeas();
};

// Allow saving with Ctrl+Enter in textarea
ideaInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    saveIdeaBtn.click();
  }
});

// Ask ChatGPT functionality
function askChatGPT() {
  const question = document.getElementById("chatgpt-query").value;
  if (!question) {
    alert("Please enter your question.");
    return;
  }
  navigator.clipboard.writeText(question).then(() => {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(question)}`, "_blank");
  }).catch(() => {
    alert("Could not copy your question, but ChatGPT will still open.");
    window.open(`https://chat.openai.com/`, "_blank");
  });
}

// Google Search Suggestions Implementation
function debounce(func, delay) {
  let timer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
}

function fetchSuggestions(query) {
  // Create a unique callback function name
  const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

  // Create the script element
  const script = document.createElement('script');

  // Set up the callback
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    displaySuggestions(data);
  };

  // Set the script source
  script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&callback=${callbackName}`;

  // Add the script to the document
  document.body.appendChild(script);
}

function displaySuggestions(data) {
  suggestionsDiv.innerHTML = '';

  if (!data || !data[1] || data[1].length === 0) {
    suggestionsDiv.style.display = 'none';
    return;
  }

  suggestionsDiv.style.display = 'block';

  data[1].forEach((suggestion, index) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
    <i class="fas fa-search"></i>
    <span>${suggestion}</span>
    `;

    suggestionItem.addEventListener('click', () => {
      searchInput.value = suggestion;
      suggestionsDiv.style.display = 'none';
      performSearch();
    });

    suggestionsDiv.appendChild(suggestionItem);
  });
}

// Handle input events with debounce
searchInput.addEventListener('input', debounce(function() {
  const query = searchInput.value.trim();
  suggestionsDiv.style.display = 'none';

  if (query.length > 1) {
    fetchSuggestions(query);
  }
}, 300));

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) &&
    !suggestionsDiv.contains(e.target) &&
    !searchButton.contains(e.target)) {
    suggestionsDiv.style.display = 'none';
  }
});

// Keyboard navigation for suggestions
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
    const visibleSuggestions = suggestionsDiv.querySelectorAll('.suggestion-item');

    if (visibleSuggestions.length === 0) return;

    let currentIndex = -1;
    for (let i = 0; i < visibleSuggestions.length; i++) {
      if (visibleSuggestions[i].classList.contains('highlighted')) {
        visibleSuggestions[i].classList.remove('highlighted');
        currentIndex = i;
        break;
      }
    }

    if (e.key === 'Enter' && currentIndex !== -1) {
      searchInput.value = visibleSuggestions[currentIndex].textContent.trim();
      suggestionsDiv.style.display = 'none';
      performSearch();
      return;
    }

    let newIndex;
    if (e.key === 'ArrowDown') {
      newIndex = (currentIndex === -1) ? 0: (currentIndex + 1) % visibleSuggestions.length;
    } else if (e.key === 'ArrowUp') {
      newIndex = (currentIndex === -1) ? visibleSuggestions.length - 1: (currentIndex - 1 + visibleSuggestions.length) % visibleSuggestions.length;
    }

    visibleSuggestions[newIndex].classList.add('highlighted');
    searchInput.value = visibleSuggestions[newIndex].textContent.trim();

    // Scroll to the highlighted item
    visibleSuggestions[newIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });

    e.preventDefault();
  }
});

// Initialize idea display
displayIdeas();
// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');
const label = themeToggle.querySelector('span');

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-theme');
  icon.classList.replace('fa-moon', 'fa-lightbulb');
  label.textContent = 'Light Mode';
}

// Toggle theme and save preference
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  const isLight = body.classList.contains('light-theme');

  if (isLight) {
    icon.classList.replace('fa-moon', 'fa-lightbulb');
    label.textContent = 'Light Mode';
    localStorage.setItem('theme', 'light');
  } else {
    icon.classList.replace('fa-lightbulb', 'fa-moon');
    label.textContent = 'Dark Mode';
    localStorage.setItem('theme', 'dark');
  }

  // Add animation effect
  icon.style.transform = 'rotate(0deg)';
  setTimeout(() => icon.style.transform = isLight ? 'rotate(180deg)': 'rotate(0deg)', 10);
});