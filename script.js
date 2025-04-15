document.addEventListener('DOMContentLoaded', function() {
    // Quiz questions data
    const quizData = [
        {
            question: "In Python, what is the key difference between a shallow copy and a deep copy when working with mutable objects?",
            options: [
                "A shallow copy references nested objects, while a deep copy recursively duplicates them.",
                "A shallow copy duplicates all objects, including nested ones, while a deep copy only copies the outer list.",
                "A deep copy is faster than a shallow copy because it does not reference the original objects.",
                "A deep copy is for immutable data, while a shallow copy works for mutable objects."
            ],
            correctAnswer: 0 // Index of the correct answer (first option)
        },
        {
            question: "Which of the following is NOT a valid way to create a list in Python?",
            options: [
                "my_list = []",
                "my_list = list()",
                "my_list = list(range(10))",
                "my_list = list.new()"
            ],
            correctAnswer: 3 // Index of the correct answer (fourth option)
        },
        {
            question: "What is the time complexity of searching for an element in a Python dictionary?",
            options: [
                "O(n)",
                "O(log n)",
                "O(1)",
                "O(n log n)"
            ],
            correctAnswer: 2 // Index of the correct answer (third option)
        },
        {
            question: "What does the 'self' parameter represent in a Python class method?",
            options: [
                "It refers to the class itself",
                "It refers to the instance of the class",
                "It is a keyword required by Python syntax",
                "It represents the parent class in inheritance"
            ],
            correctAnswer: 1 // Index of the correct answer (second option)
        },
        {
            question: "Which Python data structure maintains insertion order of elements?",
            options: [
                "Set",
                "Dictionary prior to Python 3.7",
                "Tuple",
                "List"
            ],
            correctAnswer: 3 // Index of the correct answer (fourth option)
        }
    ];

    // Track current question and user answers
    let currentQuestionIndex = 0;
    let userAnswers = [];
    
    // Get page elements
    const quizStartPage = document.getElementById('quiz-start');
    const quizQuestionsPage = document.getElementById('quiz-questions');
    const quizResultPage = document.getElementById('quiz-result');
    
    const startButton = document.getElementById('start-btn');
    const finishButton = document.getElementById('finish-btn');
    const retakeButton = document.getElementById('retake-btn');
    const startQuitButton = document.getElementById('start-quit-btn');
    const resultQuitButton = document.getElementById('result-quit-btn');
    
    // Get question elements
    const questionCard = document.querySelector('.question-card');
    const questionNumberElem = document.querySelector('.question-number');
    const questionTextElem = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options');
    
    // Get result elements
    const scoreValueElem = document.querySelector('.score-value');
    const scoreTotalElem = document.querySelector('.score-total');
    
    // Function to display a question
    function displayQuestion(questionIndex) {
        const question = quizData[questionIndex];
        
        // Update question number and text
        questionNumberElem.textContent = `Question ${questionIndex + 1}`;
        questionTextElem.textContent = question.question;
        
        // Clear existing options
        optionsContainer.innerHTML = '';
        
        // Create new option elements
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('label');
            optionElement.className = 'option';
            
            // Check if user has already answered this question
            const isChecked = userAnswers[questionIndex] === index;
            
            optionElement.innerHTML = `
                <input type="radio" name="q${questionIndex}" value="${index}" ${isChecked ? 'checked' : ''}>
                <span class="radio-custom"></span>
                <span class="option-text">${option}</span>
            `;
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Setup option click handlers
        setupOptionHandlers();
        
        // Show/hide finish button based on question index
        if (questionIndex === quizData.length - 1) {
            finishButton.style.display = 'block';
        } else {
            finishButton.style.display = 'none';
        }
        
        // Add navigation buttons if there are multiple questions
        if (quizData.length > 1) {
            addNavigationButtons(questionIndex);
        }
    }
    
    // Add next/previous navigation
    function addNavigationButtons(currentIndex) {
        // Remove existing navigation if any
        const existingNav = document.querySelector('.question-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        const navContainer = document.createElement('div');
        navContainer.className = 'question-nav';
        navContainer.style.display = 'flex';
        navContainer.style.justifyContent = 'space-between';
        navContainer.style.marginTop = '20px';
        
        // Previous button (not on first question)
        if (currentIndex > 0) {
            const prevButton = document.createElement('button');
            prevButton.className = 'btn secondary-btn';
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                // Save current answer before moving
                saveCurrentAnswer();
                currentQuestionIndex--;
                displayQuestion(currentQuestionIndex);
            });
            navContainer.appendChild(prevButton);
        } else {
            // Empty div for spacing
            navContainer.appendChild(document.createElement('div'));
        }
        
        // Next button (not on last question)
        if (currentIndex < quizData.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.className = 'btn primary-btn';
            nextButton.textContent = 'Next';
            nextButton.style.marginLeft = 'auto';
            nextButton.addEventListener('click', () => {
                // Save current answer before moving
                saveCurrentAnswer();
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex);
            });
            navContainer.appendChild(nextButton);
        } else {
            // Empty div for spacing
            navContainer.appendChild(document.createElement('div'));
        }
        
        questionCard.appendChild(navContainer);
    }
    
    // Save the current answer
    function saveCurrentAnswer() {
        const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        }
    }
    
    // Calculate score
    function calculateScore() {
        let correctCount = 0;
        
        userAnswers.forEach((answer, index) => {
            if (answer === quizData[index].correctAnswer) {
                correctCount++;
            }
        });
        
        return {
            score: correctCount,
            total: quizData.length
        };
    }
    
    // Start quiz
    startButton.addEventListener('click', function() {
        quizStartPage.style.display = 'none';
        quizQuestionsPage.style.display = 'block';
        
        // Reset quiz state
        currentQuestionIndex = 0;
        userAnswers = new Array(quizData.length);
        
        // Display first question
        displayQuestion(currentQuestionIndex);
    });
    
    // Finish quiz
    finishButton.addEventListener('click', function() {
        // Save the answer from the last question
        saveCurrentAnswer();
        
        // Calculate the score
        const result = calculateScore();
        
        // Update score display
        scoreValueElem.textContent = result.score;
        scoreTotalElem.textContent = result.total;
        
        // Show results page
        quizQuestionsPage.style.display = 'none';
        quizResultPage.style.display = 'flex';
    });
    
    // Retake quiz
    retakeButton.addEventListener('click', function() {
        quizResultPage.style.display = 'none';
        quizQuestionsPage.style.display = 'block';
        
        // Reset quiz state
        currentQuestionIndex = 0;
        userAnswers = new Array(quizData.length);
        
        // Display first question
        displayQuestion(currentQuestionIndex);
    });
    
    // Quit buttons
    startQuitButton.addEventListener('click', quitQuiz);
    resultQuitButton.addEventListener('click', quitQuiz);
    
    function quitQuiz() {
        // In a real app, this might navigate away or close the app
        alert('Quiz exited');
        
        // Reset and go back to start
        currentQuestionIndex = 0;
        userAnswers = [];
        
        quizResultPage.style.display = 'none';
        quizQuestionsPage.style.display = 'none';
        quizStartPage.style.display = 'flex';
    }
    
    // Setup option handlers
    function setupOptionHandlers() {
        const options = document.querySelectorAll('.option');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Find the radio button inside this option
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Update styling
                highlightSelectedOption();
                
                // Save answer
                saveCurrentAnswer();
            });
        });
    }
    
    function highlightSelectedOption() {
        const options = document.querySelectorAll('.option');
        
        options.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio.checked) {
                option.style.borderColor = '#5E5CEE';
                option.style.backgroundColor = '#f5f5ff';
            } else {
                option.style.borderColor = '#e0e0e0';
                option.style.backgroundColor = 'white';
            }
        });
    }
}); 