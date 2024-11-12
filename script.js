const inputField = document.getElementById("inputWords");
const groupButton = document.getElementById("groupButton");
const anagramOutput = document.getElementById("anagramOutput");
const clearAnagramButton = document.getElementById("clearAnagram");
const clearReviewButton = document.getElementById("clearButton");

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

// clear view functionality
clearButton.addEventListener("click" , () => {
    inputField.value  = "";
    anagramOutput.innerHTML = "";
});

// clear review functionlity for interview questions
clearReviewButton.addEventListener("click", () => {
const questionLIst = document.getElementById("questionList");
questionLIst.innerHTML = "";
});

clearAnagramButton.addEventListener("click", () => {
    anagramOutput.innerHTML = ""; // clears anagram output
    inputField.value = ""; // clears the input field

});
