// Elements
const loginContainer = document.querySelector('.login-container');
const selectExamContainer = document.querySelector('.SelectExam');
const rulesContainer = document.querySelector('.rules');
const typingContainer = document.querySelector('.typing');
const proceedBtn = document.getElementById('proceedBtn');
const StartExam = document.getElementById('stexam');
const examContainer = document.querySelector('.Exam');

var ExamType; // This variable will store the selected exam type for use in other scripts
var loggedInUser = null; // This variable will store the logged-in user's data

// Login form submit event
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    // Get input values
    const rollNo = document.getElementById('rollNo').value;
    const password = document.getElementById('password').value;

    // Check if user exists in usersdata
    const user = usersdata.find(user => user.rollNo == rollNo && user.password === password);

    if (user) {
        // Store the logged-in user's data
        loggedInUser = user;
        ShowDetails()
        // Proceed to Exam Selection page if login is successful
        loginContainer.style.display = 'none';
        selectExamContainer.style.display = 'block';
    } else {
        // Invalid credentials, show error message
        // document.getElementById('loginError').style.display = 'block';
        alert('Invalid credentials! Check your credentials')
    }
});

// Exam Type Selecting
document.addEventListener('DOMContentLoaded', function () {
    // Get all elements needed
    const selectExamSection = document.getElementById('select-exam-section');
    const btnSelects = document.querySelectorAll('.btn-select');

    // Add event listeners to select buttons
    btnSelects.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default link action
            const examType = btn.getAttribute('data-exam'); // Get exam type from data attribute

            // Set the global ExamType variable based on the selection
            ExamType = examType;

            // Hide the selection section
            selectExamSection.style.display = 'none';

            // Show the relevant exam rules section based on the selected type
            rulesContainer.style.display = 'block';
        });
    });

    // Proceed Button click event (inside rules container)
    proceedBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Hide the rules container
        rulesContainer.style.display = 'none';

        // Show the typing section
        typingContainer.style.display = 'block';
        loadParagraph(ExamType);

        // Additional logic to start typing test or load typing paragraph can be added here
    });

    // Start Exam Button click event (inside typing container)
    StartExam.addEventListener('click', function (e) {
        e.preventDefault();

        // Hide the typing container
        typingContainer.style.display = 'none';
        loadQuestions(ExamType)
        // Show the exam section
        examContainer.style.display = 'block';
        // Additional logic to handle the start of the exam
    });
});

function ShowDetails() {
    document.querySelectorAll('.userName').forEach(function (e) {
        console.log(e)
        e.innerText = loggedInUser.username;
    }) // Assuming you have an element with id 'userName'
    document.querySelectorAll('.rollNumber').forEach(function (e) {
        e.innerText = loggedInUser.rollNo; // Assuming you have an element with id 'userName'
    })
    document.querySelectorAll('.userImg').forEach(function (e) {
        e.src = loggedInUser.image; // Assuming you have an element with id 'userName'
    })

}
