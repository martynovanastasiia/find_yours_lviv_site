const locationQuestions = [
    {
        question: "В якому районі Львова хочете відвідати заклад?",
        possibleAnswers: ["Центр міста", "Шевченківський", "Личаківський", "Сихівський", "Франківський", "Залізничний"],
    },
    {
        question: "Які заклади у Львові вас цікавлять?",
        possibleAnswers: [
            { id: 1, answer: "Ресторан" },
            { id: 2, answer: "Кав’ярня" },
            { id: 3, answer: "Стейк-хаус" },
            { id: 4, answer: "Фаст-фуд" },
            { id: 5, answer: "Бар" },
            { id: 6, answer: "Піцерія" },
        ],
    },
    {
        question: "Які види кухні ви хотіли б спробувати?",
        possibleAnswers: [
            { id: 1, answer: "Українська" },
            { id: 2, answer: "Європейська" },
            { id: 3, answer: "Азійська" },
            { id: 4, answer: "Американська" },
            { id: 5, answer: "Грузинська" },
            { id: 6, answer: "Італійська" },
            // { id: 7, answer: "" },
        ],
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
        possibleAnswers: [
            { id: 1, answer: "Банкети" },
            { id: 2, answer: "Сімейний відпочинок" },
            { id: 3, answer: "Побачення" },
            { id: 4, answer: "Ситно поїсти" },
            { id: 5, answer: "Зустріч з друзями" },
        ],
    },
];

const placeQuestions = [
    {
        question: "В якому районі Львова хочете відвідати локацію?",
        possibleAnswers: ["Центр міста", "Шевченківський", "Личаківський", "Сихівський", "Франківський", "Залізничний"],
    },
    {
        question: "Як тип відпочинку обираєте?",
        possibleAnswers: [
            { id: 6, answer: "Активний" },
            { id: 7, answer: "Пасивний" },
            { id: 2, answer: "Сімейний" },
            { id: 8, answer: "Культурний" },
            { id: 9, answer: "Розважальний" },
        ],
    },
    {
        question: "Який тип локацій вам цікавий?",
        possibleAnswers: [
            { id: 7, answer: "Парки" },
            { id: 10, answer: "Пам’ятки архітектури" },
            { id: 9, answer: "Галереї" },
            { id: 8, answer: "Театри" },
            { id: 13, answer: "Музеї" },
            { id: 11, answer: "Кінотеатри" },
            { id: 12, answer: "Церкви/Собори" },
            { id: 14, answer: "Інше" },
        ],
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
    let userAnswers = {}; // Зберігаємо відповіді за індексами питань

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
                generateRequest();
            }
        });
    }

    function handleQuestion(index) {
        // Оновлюємо прогрес
        quizProgress.innerHTML = "";
        questions.forEach((_, i) => {
            quizProgress.innerHTML += `<span class="${i <= index ? 'complete' : ''}"></span>`;
        });

        // Відображаємо питання
        questionContainer.innerHTML = `<h1>${questions[index].question}</h1>`;

        // Відображаємо варіанти відповідей
        optionsContainer.innerHTML = "";
        questions[index].possibleAnswers.forEach((answer) => {
            const answerText = typeof answer === "string" ? answer : answer.answer;
            const answerId = typeof answer === "string" ? answer : answer.id;
            const isSelected = userAnswers[index]?.some(a => a.id === answerId || a.answer === answerText) ? 'selected' : '';

            optionsContainer.innerHTML += `<button class="option ${isSelected}" data-id="${answerId || ''}">${answerText}</button>`;
        });

        document.querySelectorAll(".option").forEach(option => {
            option.addEventListener("click", (e) => {
                const answerId = e.target.dataset.id ? parseInt(e.target.dataset.id) : null;
                const answerText = e.target.textContent;

                if (!userAnswers[index]) {
                    userAnswers[index] = [];
                }
                // Якщо питання стосується "пет-френдлі", дозволяємо обрати лише одну відповідь
                if (questions[currentQuestionIndex].question.includes("пет-френдлі")) {
                    userAnswers[currentQuestionIndex] = [{ id: answerId, answer: answerText }];
                    document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
                } else {
                    // Додаємо або видаляємо відповідь для інших питань
                    const existingAnswerIndex = userAnswers[currentQuestionIndex].findIndex(a => a.id === answerId || a.answer === answerText);
                    if (existingAnswerIndex === -1) {
                        userAnswers[currentQuestionIndex].push({ id: answerId, answer: answerText });
                    } else {
                        userAnswers[currentQuestionIndex].splice(existingAnswerIndex, 1);
                    }
                }
                e.target.classList.toggle("selected");
            });
        });
    }

    function generateRequest() {
        const params = {
            types_to_sort: [],
            districts_to_sort: [],
            purposes_to_sort: [],
            cuisines_to_sort: [],
            pet_friendly: "",
            budgets_to_sort: []
        };

        questions.forEach((question, index) => {
            const answers = userAnswers[index] || [];

            //вивід для діагностики
            console.log(`Processing question: ${question.question}`);
            console.log(`Answers:`, answers);

            // Якщо немає відповіді, обираємо всі варіанти
            if (answers.length === 0) {
                if (question.question.includes("район")) {
                    params.districts_to_sort = question.possibleAnswers.map(a => a);
                } else if (index === 1 && question.question.includes("заклади")) {
                    params.types_to_sort = question.possibleAnswers.map(a => a.id).filter(id => id !== undefined);
                }else if (question.question.includes("локацій")) {
                    params.types_to_sort = question.possibleAnswers.map(a => a.id).filter(id => id !== undefined);
                } else if (question.question.includes("кухні")) {
                    params.cuisines_to_sort = question.possibleAnswers.map(a => a.id).filter(id => id !== undefined);
                    if (!params.cuisines_to_sort.includes(7)) {
                        params.cuisines_to_sort.push(7);
                    }
                } else if (question.question.includes("пет-френдлі")) {
                    params.pet_friendly = "Неважливо";
                } else if (question.question.includes("бюджет")) {
                    params.budgets_to_sort = question.possibleAnswers.map(a => a);
                } else if (question.question.includes("метою")) {
                    params.purposes_to_sort = question.possibleAnswers.map(a => a.id).filter(id => id !== undefined);
                }else if (question.question.includes("відпочинку")) {
                    params.purposes_to_sort = question.possibleAnswers.map(a => a.id).filter(id => id !== undefined);
                }
            } else {
                // Обробка вибраних відповідей
                if (question.question.includes("район")) {
                    params.districts_to_sort = answers.map(a => a.answer);
                } else if (index === 1 && question.question.includes("заклади")) {
                    params.types_to_sort = answers.filter(a => a.id).map(a => a.id);
                }else if (question.question.includes("локацій")) {
                    params.types_to_sort = answers.filter(a => a.id).map(a => a.id);
                } else if (question.question.includes("кухні")) {
                    params.cuisines_to_sort = answers.filter(a => a.id).map(a => a.id);
                    if (!params.cuisines_to_sort.includes(7)) {
                        params.cuisines_to_sort.push(7);
                    }
                } else if (question.question.includes("пет-френдлі")) {
                    params.pet_friendly = answers[1]?.answer || answers[0]?.answer;
                } else if (question.question.includes("бюджет")) {
                    params.budgets_to_sort = answers.map(a => a.answer);
                } else if (question.question.includes("метою")) {
                    params.purposes_to_sort = answers.filter(a => a.id).map(a => a.id);
                }else if (question.question.includes("відпочинку")) {
                    params.purposes_to_sort = answers.filter(a => a.id).map(a => a.id);
                }
            }
        });

        console.log("Generated params:", params);

        const query = Object.entries(params)
            .map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                    return `${key}=[${value.map(v => (typeof v === 'number' ? v : `\"${v}\"`)).join(",")}]`;
                } else if (typeof value === 'string' && value) {
                    return `${key}="${value}"`;
                }
                return null;
            })
            .filter(Boolean)
            .join("&");

        const endpoint = `../recommendations?\n${query}`;
        console.log(endpoint);
    }
    // Обробка подій для кнопок
    // document.querySelector('.nav-button.end').addEventListener('click', () => {
    //     // Викликаємо функцію для генерації параметрів
    //     generateRequest();
    //
    //     // Направляємо користувача до сторінки результатів
    //     window.location.href = '../recommendations'; // Змініть URL на потрібний
    // });
    // const endSurveyButton = document.querySelector('.nav-button.end');
    // if (endSurveyButton) {
    //     endSurveyButton.addEventListener('click', () => {
    //         alert('Опитування завершено. Дякуємо за вашу участь!');
    //         // Додати логіку завершення опитування, наприклад, перехід на головну сторінку
    //         window.location.href = '/main-page(index)'; // Змінити на потрібний URL
    //     });
    // }
});