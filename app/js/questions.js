const locationQuestions = [
    {
        question: "В якому районі Львова хочете відвідати заклад?",
        possibleAnswers: ["Центр міста", "Шевченківський", "Личаківський", "Сихівський", "Франківський", "Залізничний"],
    },
    {
        question: "Які заклади у Львові вас цікавлять?",
        possibleAnswers: ["Ресторани", "Кав’ярня", "Стейк-хаус", "Фаст-фуд", "Бари", "Піцерія"],
    },
    {
        question: "Які види кухні ви хотіли б спробувати?",
        possibleAnswers: ["Українська", "Європейська", "Азійська", "Американська", "Грузинська", "Італійська"],
    },
    {
        question: "Чи цікавлять пет-френдлі заклади?",
        possibleAnswers: ["Так", "Неважливо"],
    },
    {
        question: "На який бюджет ви розраховуєте?",
        possibleAnswers: ["Мінімальний", "Середній", "Преміум"],
    },
    {
        question: "З якою метою ви шукаєте заклад?",
        possibleAnswers: ["Банкети", "Сімейний відпочинок", "Побачення", "Ситно поїсти", "Зустріч з друзями"],
    },
];

const placeQuestions = [
    {
        question: "В якому районі Львова хочете відвідати заклад?",
        possibleAnswers: ["Центр міста", "Шевченківський", "Личаківський", "Сихівський", "Франківський", "Залізничний"],
    },
    {
        question: "Як тип відпочинку обираєте?",
        possibleAnswers: ["Активний", "Пасивний", "Сімейний", "Культурний", "Розважальний"],
    },
    {
        question: "Який тип локацій вам цікавий?",
        possibleAnswers: ["Парки", "Пам’ятки архітектури", "Галереї", "Театри", "Музеї", "Кінотеатри", "Церкви/Собори", "Інше"],
    },
]


document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quizContainer");
    const pageType = quizContainer?.dataset.pageType;

    if (!quizContainer || !pageType) {
        console.error("Не знайдено контейнер або тип сторінки.");
        return;
    }
    const quizProgress = document.querySelector(".progress-bars");
    const questionContainer = document.querySelector(".question");
    const optionsContainer = document.querySelector(".options");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    let questions;
    if (pageType === "location") {
        questions = locationQuestions;
    } else if (pageType === "place") {
        questions = placeQuestions;
    } else {
        console.error("Невідомий тип сторінки.");
        return;
    }

    let currentQuestionIndex = 0;
    let userAnswers = {};

    initializeQuiz();

    function initializeQuiz() {
        handleQuestion(currentQuestionIndex);

        leftArrow.addEventListener("click", () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                handleQuestion(currentQuestionIndex);
            }
        });

        rightArrow.addEventListener("click", () => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                handleQuestion(currentQuestionIndex);
            } else {
                console.log(userAnswers);
                // showResults();
            }
        });
    }

    function handleQuestion(index) {
        //Оновлюємо прогрес
        quizProgress.innerHTML = "";
        questions.forEach((_, i) => {
            quizProgress.innerHTML += `<span class="${i <= index ? 'complete' : ''}"></span>`;
        });

        // Відображаємо питання
        questionContainer.innerHTML = `<h1>${questions[index].question}</h1>`;

        // Відображаємо варіанти відповідей
        optionsContainer.innerHTML = "";
        questions[index].possibleAnswers.forEach((answer) => {
            const isSelected = userAnswers[index]?.includes(answer) ? 'selected' : '';
            optionsContainer.innerHTML += `<button class="option ${isSelected}">${answer}</button>`;
        });

        document.querySelectorAll(".option").forEach(option => {
            option.addEventListener("click", (e) => {
                const selectedAnswer = e.target.textContent;

                if (!userAnswers[index]) {
                    userAnswers[index] = [];
                }
                if (!userAnswers[index].includes(selectedAnswer)) {
                    userAnswers[index].push(selectedAnswer);
                    e.target.classList.add("selected");
                } else {
                    userAnswers[index] = userAnswers[index].filter(ans => ans !== selectedAnswer);
                    e.target.classList.remove("selected");
                }
            });
        });
    }
//     function showResults() {
//         questionContainer.innerHTML = "<h1>Результати:</h1>";
//         optionsContainer.innerHTML = Object.entries(userAnswers).map(([index, answers]) => `
//             <div>
//                 <h2>${questions[index].question}</h2>
//                 <p>${answers.join(", ") || "Не обрано"}</p>
//             </div>
//         `).join("");
//     }
});