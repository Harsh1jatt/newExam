let currentQuestionIndex = 0;
let currentExamType = ''; // To track the type of exam currently being displayed
let selectedAnswers = {}; // Object to store selected answers for each type and question
let correctAnswers = {}; // Object to store correct answers for each type and question
let completedTypes = new Set(); // Set to track completed question types

// Function to initialize and load questions based on the exam type
function loadQuestions(examType) {
    currentExamType = examType;

    let questions;

    // Fetch questions based on exam type
    if (examType === 'basic') {
        questions = basicExam;
    } else if (examType === 'accounts') {
        questions = accountsExam;
    } else if (examType === 'coding') {
        questions = codingExam;
    }

    // Group questions by type
    const groupedQuestions = groupQuestionsByType(questions);

    // Store correct answers for each question type
    storeCorrectAnswers(groupedQuestions);

    // Generate navigation tabs
    generateNavTabs(groupedQuestions);

    // Display the first question of the selected exam type
    displayQuestions(groupedQuestions[currentExamType]);
}


// Function to group questions by type
function groupQuestionsByType(questions) {
    const groupedQuestions = {};
    questions.forEach(question => {
        const type = question.type;
        if (!groupedQuestions[type]) {
            groupedQuestions[type] = [];
        }
        groupedQuestions[type].push(question);
    });
    return groupedQuestions;
}

// Function to store correct answers for each question type
function storeCorrectAnswers(groupedQuestions) {
    Object.keys(groupedQuestions).forEach(type => {
        if (!correctAnswers[type]) {
            correctAnswers[type] = {};
        }
        groupedQuestions[type].forEach((question, index) => {
            correctAnswers[type][index] = question.correctAnswer;
        });
    });
}

// Function to generate navigation tabs
function generateNavTabs(groupedQuestions) {
    const navTabs = document.querySelector('.nav-tabs');
    navTabs.innerHTML = ''; // Clear existing tabs

    Object.keys(groupedQuestions).forEach((type, index) => {
        const button = document.createElement('button');
        button.className = 'tab';
        if (index === 0) button.classList.add('active'); // Set the first tab as active by default
        button.textContent = formatTypeName(type); // Convert the type to a user-friendly name

        button.addEventListener('click', () => {
            document.querySelector('.tab.active').classList.remove('active');
            button.classList.add('active');
            currentExamType = type; // Update the current exam type
            currentQuestionIndex = 0; // Reset the question index for the new type
            displayQuestions(groupedQuestions[type]); // Display the questions for the selected type
        });

        navTabs.appendChild(button);
    });
}

// Helper function to format type names (e.g., convert 'computerFundamental' to 'Computer Fundamental')
function formatTypeName(type) {
    return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Function to display questions
function displayQuestions(questions) {
    if (questions && questions.length > 0) {
        const questionSection = document.querySelector('.question-section');

        // Function to render the current question
        function renderQuestion(index) {
            // Clear the question section before displaying the next question
            questionSection.innerHTML = '';

            const question = questions[index];

            // Create a container for the current question
            const questionContainer = document.createElement('div');
            questionContainer.className = 'question-container';

            // Dynamically generate question number based on index (starting from 1)
            const questionNumber = document.createElement('h3');
            questionNumber.textContent = `Question No. ${index + 1}`;

            const questionText = document.createElement('p');
            questionText.textContent = question.question;

            const optionsForm = document.createElement('form');

            // Add options dynamically and check if an answer is already selected
            question.options.forEach(option => {
                const label = document.createElement('label');
                const checked = selectedAnswers[currentExamType] && selectedAnswers[currentExamType][index] === option ? 'checked' : '';
                label.innerHTML = `<input type="radio" name="answer${index}" value="${option}" ${checked}> ${option}`;
                optionsForm.appendChild(label);
                optionsForm.appendChild(document.createElement('br'));
            });

            // Append question number, question text, and options to the question container
            questionContainer.appendChild(questionNumber);
            questionContainer.appendChild(questionText);
            questionContainer.appendChild(optionsForm);

            // Append the question container to the question section
            questionSection.appendChild(questionContainer);

            // Create "Previous" and "Next" buttons
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = index === 0; // Disable "Previous" if it's the first question
            prevButton.addEventListener('click', () => {
                saveAnswer(index); // Save the selected answer before moving
                currentQuestionIndex--;
                renderQuestion(currentQuestionIndex);
            });

            const nextButton = document.createElement('button');
            nextButton.textContent = index === questions.length - 1 ? 'Finish' : 'Next'; // "Finish" for the last question
            nextButton.addEventListener('click', () => {
                saveAnswer(index); // Save the selected answer before moving
                if (index < questions.length - 1) {
                    currentQuestionIndex++;
                    renderQuestion(currentQuestionIndex);
                } else {
                    markTypeCompleted(currentExamType);
                    // Finish the exam
                    if (allTypesCompleted()) {
                        const score = calculateScore();
                        alert(`You have completed the exam! Your score is: ${score}/${totalQuestions()}`);
                        console.log('Selected Answers:', selectedAnswers);
                    } else {
                        alert('You need to complete all types of questions before submitting.');
                    }
                }
            });

            // Append buttons to the question section
            questionSection.appendChild(prevButton);
            questionSection.appendChild(nextButton);
        }

        // Function to save the selected answer
        function saveAnswer(index) {
            const selectedOption = questionSection.querySelector(`input[name="answer${index}"]:checked`);
            if (selectedOption) {
                if (!selectedAnswers[currentExamType]) {
                    selectedAnswers[currentExamType] = {};
                }
                selectedAnswers[currentExamType][index] = selectedOption.value; // Save the selected option value
            }
        }

        // Function to check if all question types are completed
        function allTypesCompleted() {
            return completedTypes.size === Object.keys(groupedQuestions).length;
        }

        // Function to calculate the score
        function calculateScore() {
            let score = 0;
            Object.keys(selectedAnswers).forEach(type => {
                Object.keys(selectedAnswers[type]).forEach(index => {
                    if (selectedAnswers[type][index] === correctAnswers[type][index]) {
                        score++;
                    }
                });
            });
            return score;
        }

        // Function to get total number of questions
        function totalQuestions() {
            let total = 0;
            Object.keys(correctAnswers).forEach(type => {
                total += Object.keys(correctAnswers[type]).length;
            });
            return total;
        }

        // Render the first question initially
        renderQuestion(currentQuestionIndex);
    }
}

// Function to mark a type as completed
function markTypeCompleted(type) {
    completedTypes.add(type);
}
