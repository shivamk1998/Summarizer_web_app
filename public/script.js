

const MAX_TRANSCRIPTION_LENGTH = 4096;

const transcriptionInput = document.getElementById('transcription');
const summaryElement = document.getElementById('summary');
const loader = document.getElementById('loader');
const fileInput = document.getElementById('fileInput');
const fileNameElement = document.getElementById('fileName');
const changeLan = document.getElementById('changeLanguage');
const keyField = document.getElementById('openai-key')


let API_KEY = localStorage.getItem('API_KEY')


async function summarizeText() {
  const transcription = transcriptionInput.value;

  if (transcription.length > MAX_TRANSCRIPTION_LENGTH) {
    summaryElement.innerHTML = '<p style="color:red">This model maximum context length is exceeded. Please lower the prompt</p>';
    return;
  }

  const gptOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `Summarize the following transcription:\n\n${transcription}`,
      temperature: 0,
      top_p: 1,
      max_tokens: 250,
    })
  };

  try {
    if (transcription === '') {
      // showErrorToast("Provide Transcription");
      alert("Provide Transcription");
    } else {
      showButtonLoader() // Show the loader
      const response = await fetch('https://api.openai.com/v1/completions', gptOptions);
      if (response.status === 401) {
        alert("You have Provide Incorrect API Key.")
        keyPage.style.display = 'block';
        mainApp.style.display = 'none';
        landingPage.style.display = 'none';
      } else if (response.status === 429) {
        alert("You exceeded your current quota, please check your plan and billing details")
        keyPage.style.display = 'block';
        mainApp.style.display = 'none';
        landingPage.style.display = 'none';
      }
      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const summary = data.choices[0].text.trim();
        summaryElement.innerHTML = summary;
      } else {
        summaryElement.innerHTML = 'No summary found.';
      }
    }
  } catch (error) {
   
    summaryElement.innerHTML = '<p>An error occurred. Please try again later.</p>';
    changeLan.style.display = 'none';
  } finally {
    hideButtonLoader()
  }
}


function clearFields() {
  transcriptionInput.value = '';
  fileInput.value = '';
  summaryElement.innerHTML = '';
}



// Show the loader on the button
function showButtonLoader() {
  document.getElementById("paraphraseBtnText").style.display = "none";
  document.getElementById("paraphraseBtnLoader").classList.remove("d-none");
}

// Hide the loader on the button
function hideButtonLoader() {
  document.getElementById("paraphraseBtnText").style.display = "inline";
  document.getElementById("paraphraseBtnLoader").classList.add("d-none");
}

// Copy the output text to the clipboard
function copyOutputText() {
  var outputText = document.getElementById("summary");

  // Select the text in the textarea
  outputText.select();
  outputText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Deselect the text
  outputText.blur();
}

function countWords() {
  const text = document.getElementById('summary').value;
  
  // Removing punctuation marks and converting text to lowercase
  const cleanedText = text.replace(/[^\w\s]|_/g, "").toLowerCase();

  // Splitting text into individual words
  const words = cleanedText.split(/\s+/);

  // Counting the occurrences of each word
  const wordCount = {};
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word in wordCount) {
      wordCount[word]++;
    } else {
      wordCount[word] = 1;
    }
  }

  // Displaying the word count
  const wordCountOutput = document.getElementById('wordCount');
  wordCountOutput.textContent = wordCount;
}

// Adding event listener to the text field
const outputText = document.getElementById('summary');
outputText.addEventListener('input', countWords);

let currentLanguage = 'en';

function showChangeLanguageDialog() {
  $('#languageDialog').modal('show');
}

function changeLanguage() {
  const selectedLanguage = document.getElementById('languageSelect').value;
  if (selectedLanguage !== currentLanguage) {
    currentLanguage = selectedLanguage;
    translateSummary();
  }
  $('#languageDialog').modal('hide');
}

async function translateSummary() {
  const originalSummary = summaryElement.textContent;

  // loader.style.display = 'block'; // Show the loader

  const selectedLanguage = document.getElementById('languageSelect').value;
  if (selectedLanguage !== currentLanguage) {
    currentLanguage = selectedLanguage;
  }

  const translationOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: `text-davinci-003`,
      prompt: `"${originalSummary}" Translate the give text into ${currentLanguage}`,
      temperature: 0,
      max_tokens: 250,
    })
  };

  try {
    showButtonLoader()
    const response = await fetch('https://api.openai.com/v1/completions', translationOptions);
    const data = await response.json();
  
    if (data.choices && data.choices.length > 0) {
      const translatedSummary = data.choices[0].text.trim();
      summaryElement.innerHTML = `Translated Summary (${currentLanguage.toUpperCase()}): ${translatedSummary}`;
    } else {
      summaryElement.innerHTML = 'No translation available.';
    }
  } catch (error) {
    
    summaryElement.innerHTML = 'An error occurred during translation. Please try again later.';
  } finally {
    hideButtonLoader()
  }
}

