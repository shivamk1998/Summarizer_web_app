const transText = document.getElementById('transcription')
const paraphraseBtn = document.getElementById('paraphraseBtn')
// const fileInput = document.getElementById('fileInput');
const paraphraseFile = document.getElementById('paraphraseFile');

fileInput.addEventListener('change', function () {
  // Check if a file has been selected
  if (fileInput.files.length === 0) {
    // If no file selected, hide the paraphraseFile button
    paraphraseFile.style.display = 'none';
  } else {
    const transcriptionInput = document.getElementById('transcription');
    // If a file is selected, show the paraphraseFile button
    paraphraseFile.style.display = 'block';
    transcriptionInput.value = '';
    paraphraseBtn.style.display = 'none';

  }
});


transText.addEventListener('input', function () {
  // Check if the textarea is empty
  if (transText.value.trim() === '') {
    // If empty, hide the summarizeText button
    paraphraseBtn.style.display = 'none';
  } else {
    // If not empty, show the summarizeText button
    paraphraseBtn.style.display = 'block';
    paraphraseFile.style.display = 'none';
  }
})


document.getElementById('transcriptionForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  transcriptionInput.value = '';
  summaryElement.innerHTML = ''
  var form = e.target;
  var formData = new FormData(form);


  try {
    showButtonLoader()
    const response = await fetch('/transcribe', {
      method: 'POST',
      body: formData
    })
    var data = await response.json()
    const gptOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Summarize the following transcription and highlight the characters:\n\n${data.transcription}`,
        top_p: 1,
        max_tokens: 100,
      })
    };
    const response1 = await fetch('https://api.openai.com/v1/completions', gptOptions);
    const data1 = await response1.json();
    var resultContainer = document.getElementById('summary');
    if (data1.choices && data1.choices.length > 0) {
      const summary = data1.choices[0].text.trim();

      resultContainer.innerHTML = summary;
    } else {
      resultContainer.innerHTML = 'No summary found.';
    }
  } catch (error) {
    var resultContainer = document.getElementById('summary');
    resultContainer.innerHTML = 'An error occurred during transcription.';
  } finally {
    hideButtonLoader()
  }

})

const landingPage = document.getElementById("container-1")
const keyPage = document.getElementById("container-2")
const mainApp = document.getElementById("container-3")
const header = document.getElementById('appHeader')
// const keyField = document.getElementById('openai-key')

function enterKeyPage() {
  landingPage.style.display = 'none';
  let API_KEY = localStorage.getItem('API_KEY');
  if (API_KEY === null || API_KEY === '') {
    keyPage.style.display = 'block';
  } else {
    header.style.display = 'block';
    mainApp.style.display = 'block';
  }
}



function openApp() {
  API_KEY = keyField.value
  localStorage.setItem('API_KEY', API_KEY)
  mainApp.style.display = 'block'
  header.style.display = 'block';
  keyPage.style.display = 'none'
  landingPage.style.display = 'none'

}

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'

// import { getDatabase, ref, push, get, remove } from
//   'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js'

// const firebaseConfig = {
//   apiKey: "AIzaSyALopCQuM1Ardt38h9mgwk6MdXNM__0AQ0",
//   authDomain: "summarizer-web-app-a45b7.firebaseapp.com",
//   databaseURL: '',
//   projectId: "summarizer-web-app-a45b7",
//   storageBucket: "summarizer-web-app-a45b7.appspot.com",
//   messagingSenderId: "1033427588262",
//   appId: "1:1033427588262:web:8f21a8b311a9caac8a5067",
//   measurementId: "G-TBPW35VT5J"
// };

// firebase.initializeApp(firebaseConfig);

// // Function to save the API key to Firebase
// function saveApiKey() {
//   const openAIKey = document.getElementById("openai-key").value;
//   if (openAIKey) {\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//     // Save the API key to Firebase
//     firebase.database().ref("/api_key").set(openAIKey)
//       .then(() => {
//         console.log("API key saved to Firebase:", openAIKey);
//         // Optionally, you can redirect the user to another page or display a success message here.
//       })
//       .catch((error) => {
//         console.error("Error saving API key to Firebase:", error);
//         // Handle the error, e.g., display an error message to the user.
//       });
//   } else {
//     console.error("No API key entered.");
//     // Optionally, you can display an error message to the user if no API key is entered.
//   }
// }