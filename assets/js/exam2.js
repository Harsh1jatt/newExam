const NavTabs = document.querySelector('#nav-tabs');
const questionContainer = document.querySelector('#question-container');
let QuestionType = '';
let currentQuestionIndex = 0;
let currentQuestions = [];
let userAnswers = []; // Array to store user's answers

function loadQuestions(eType) {
    let questions = [];

    // Load questions based on the selected exam type
    if (eType === 'basic') {
        questions = basicExam;
    } else if (eType === 'accounts') {
        questions = accountsExam;
    } else if (eType === 'coding') {
        questions = codingExam;
    }

    // Create an object to store the questions grouped by their type
    let questionsByType = {};

    // Loop through all questions and group them by their type
    questions.forEach(question => {
        let groupQuest = question.type;

        // If the type doesn't exist in the object, create an empty array
        if (!questionsByType[groupQuest]) {
            questionsByType[groupQuest] = [];
        }

        // Push the question into the respective type array
        questionsByType[groupQuest].push(question);
    });

    console.log(questionsByType);
    createTypeButtons(questionsByType); // Pass the object to createTypeButtons
    return questionsByType;
}

function createTypeButtons(questionTypes) {
    // Clear existing buttons if any
    NavTabs.innerHTML = '';

    // Get the keys of the questionTypes object
    const typesArray = Object.keys(questionTypes);
    let currentActiveButton = null; // Track the currently active button

    // Loop through the typesArray to create buttons
    typesArray.forEach((type, index) => {
        // Create a new button element
        const button = document.createElement('button');

        // Set the button's inner text to the type
        button.innerText = type;

        // Assign the 'tab' class to the button
        button.classList.add('tab');
        button.setAttribute('id', type);

        // Make the first button active by default
        if (index === 0) {
            button.classList.add('active');
            currentActiveButton = button; // Set the initial active button
            setSubtype(type, questionTypes); // Set initial subtype to the first button's type
        }

        // Add click event listener to handle the activation
        button.addEventListener('click', function () {
            if (currentActiveButton !== button) {
                // Remove the active class from the previously active button
                if (currentActiveButton) {
                    currentActiveButton.classList.remove('active');
                }

                // Set the clicked button as active
                button.classList.add('active');
                currentActiveButton = button;

                // Update the subtype based on the clicked button's type
                setSubtype(type, questionTypes);
            }
        });

        // Append the button to the container
        NavTabs.appendChild(button);
    });
}

// This function will handle setting the current subtype and displaying corresponding questions
function setSubtype(subtype, questionTypes) {
    QuestionType = subtype;
    currentQuestions = questionTypes[subtype]; // Set the questions for the selected type
    currentQuestionIndex = 0; // Reset to the first question
    displayQuestion(); // Display the first question
}

// Function to display a question based on the current index
function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];

    if (question) {
        // Set the question text
        questionContainer.querySelector('h3').innerText = `Question No ${currentQuestionIndex + 1}`;
        questionContainer.querySelector('p').innerText = question.question;

        // Set the options and check the previously selected answer
        const optionsContainer = questionContainer.querySelector('form');
        optionsContainer.innerHTML = ''; // Clear existing options

        question.options.forEach(option => {
            // Create a new label for each option
            const label = document.createElement('label');
            const input = document.createElement('input');
            
            input.type = 'radio';
            input.name = 'answer';
            input.value = option;

            // Check the previously selected answer if it exists
            const userAnswer = userAnswers.find(answer => answer.questionId === question.id);
            if (userAnswer && userAnswer.userAnswer === option) {
                input.checked = true;
            }

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            optionsContainer.appendChild(label);
            optionsContainer.appendChild(document.createElement('br'));
        });
    }

    // Update buttons' disabled state
    document.getElementById('pre').disabled = currentQuestionIndex === 0;
    document.getElementById('nex').disabled = currentQuestionIndex === currentQuestions.length - 1;
}

// Function to save the user's answer
function saveUserAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (currentQuestion) {
        // Find if there's already an entry for this question
        const existingAnswerIndex = userAnswers.findIndex(answer => answer.questionId === currentQuestion.id);

        // Save the user's answer
        const answerData = {
            questionId: currentQuestion.id,
            question: currentQuestion.text,
            correctAnswer: currentQuestion.answer,
            userAnswer: selectedOption ? selectedOption.value : null
        };

        if (existingAnswerIndex > -1) {
            // Update the existing entry
            userAnswers[existingAnswerIndex] = answerData;
        } else {
            // Add a new entry
            userAnswers.push(answerData);
        }
    }
}

// Add event listeners for Previous and Next buttons
document.getElementById('pre').addEventListener('click', function () {
    saveUserAnswer(); // Save the answer before moving to the previous question
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

document.getElementById('nex').addEventListener('click', function () {
    saveUserAnswer(); // Save the answer before moving to the next question
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});
