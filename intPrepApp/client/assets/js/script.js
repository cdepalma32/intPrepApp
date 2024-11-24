const interviewQuestions = [
    "What is a closure in Javascript?",
    "What is CORS?",
    "What is the difference between flexbox and grid in CSS?",
    "Best practices for creating a RESTful API in Node.js?",
    "List a significant difference between GraphQL and API"
]

const inputField = document.getElementById("inputWords");
const groupButton = document.getElementById("groupButton");
const anagramOutput = document.getElementById("anagramOutput");
const clearAnagramButton = document.getElementById("clearAnagram"); 
const clearReviewButton = document.getElementById("clearReview"); 

// add event listener for grouping anagrams
groupButton.addEventListener("click", () => {
// clear previous results
anagramOutput.innerHTML = "";

    // get user input and split it into an array of words
const words = inputField.value.split(",").map(word => word.trim());


// create a hash map to store groups of anagrams
const anagramGroups = {};


// loop through each word, sort the characers, and use the sorted verson as the key
words.forEach(word => {
    const sortedWord = word.split("").sort().join("");

    // add the word to the appropriate group in the hash map
    if (!anagramGroups[sortedWord]) {
        anagramGroups[sortedWord] = [];
    }
    anagramGroups[sortedWord].push(word);
});

// display the grouped anagrams
for (const group in anagramGroups) {
    const groupDiv = document.createElement('div');
    groupDiv.textContent = `Group: ${anagramGroups[group].join(",")}`;
    anagramOutput.appendChild(groupDiv);
    
}

});

// Clear functionality for the anagram section
clearAnagramButton.addEventListener("click", () => {
    anagramOutput.innerHTML = ""; // Clears anagram output
    inputField.value = "";        // Clears the input field
});

// Clear functionality for the interview question review section
clearReviewButton.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".progress-checkbox");  // Select all checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;  // Uncheck each checkbox
    });
});


function populateQuestions() {
    const questionList = document.getElementById("questionList");
// clear existing questions in case this is called mulitple times
    questionList.innerHTML = "";

    // loop through the interviewQuestions array and create list items
    interviewQuestions.forEach(question => {
    const listItem = document.createElement("li");
    listItem.textContent = question;


    // optionally, add a checkbox for tracking progress
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "progress-checkbox";

    // append checkbox and question to the list item
    listItem.prepend(checkbox);

    // add the list item to the question list
    questionList.appendChild(listItem);
});
}

// populate interview questions on page load
populateQuestions();

