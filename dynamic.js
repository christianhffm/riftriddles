// Parse the URL to get the search parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the category value from the search parameters
const category = urlParams.get('category');

// Function to add the quiz content based on the category
function addQuizContent(category) {
    const quizContainer = document.querySelector('.quizcontainer');
    let content = '';

    // Shared HTML structure
    content += `
            <div class="questionheader">Quiz Title</div>
            <div id="question"></div>
            <div class="subrow">
                <input type="text" id="answer">
                <ul id="quiz-list"></ul>
                <button onclick="checkAnswer()" id="submit">Submit</button>
            </div>
            <div id="result"></div>
            Attempted Items:
            <ul id="attempted-items-list"></ul>
        `;

    // Category-specific content
    if (category === 'champions') {
        content += `
                <p>Category-specific content for Champions goes here.</p>
            `;
    } else if (category === 'abilities') {
        content += `
                <p>Category-specific content for Abilities goes here.</p>
            `;
    } else if (category === 'items') {
        content += `
                <p>Category-specific content for Items goes here.</p>
            `;
    }
    // Add more conditions for other categories

    quizContainer.innerHTML = content;
}

// Apply different content based on the category
if (category) {
    addQuizContent(category);
}

