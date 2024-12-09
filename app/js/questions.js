// // Імена файлів питань
// const questionFiles = [
//     "./html/location-questionnaire/question-1.html",
//     "./html/location-questionnaire/question-2.html",
//     "./html/location-questionnaire/question-3.html",
//     "./html/location-questionnaire/question-4.html",
//     "./html/location-questionnaire/question-5.html",
//     "./html/location-questionnaire/question-6.html",
// ];
//
// // Індекс поточного питання
// let currentQuestionIndex = 0;
//
// // Елемент, у який завантажуються питання
// const questionnaireContainer = document.getElementById("questionnaire");
//
// // Функція для завантаження HTML файлу
// function loadQuestion(index) {
//     if (index >= 0 && index < questionFiles.length) {
//         fetch(questionFiles[index])
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`Помилка завантаження файлу: ${response.statusText}`);
//                 }
//                 return response.text();
//             })
//             .then((html) => {
//                 // Завантажуємо HTML у контейнер
//                 questionnaireContainer.innerHTML = html;
//
//                 // Оновлюємо прогрес-бари
//                 updateProgressBars(index);
//             })
//             .catch((error) => {
//                 console.error("Помилка:", error);
//             });
//     }
// }
//
// // Функція оновлення прогрес-барів
// function updateProgressBars(index) {
//     const progressBars = document.querySelectorAll(".progress-bars > div");
//     progressBars.forEach((bar, i) => {
//         bar.classList.toggle("active", i === index);
//     });
// }
//
// // Обробник для стрілок
// document.querySelector(".left-arrow").addEventListener("click", () => {
//     if (currentQuestionIndex > 0) {
//         currentQuestionIndex--;
//         loadQuestion(currentQuestionIndex);
//     }
// });
//
// document.querySelector(".right-arrow").addEventListener("click", () => {
//     if (currentQuestionIndex < questionFiles.length - 1) {
//         currentQuestionIndex++;
//         loadQuestion(currentQuestionIndex);
//     }
// });
//
// // Завантаження першого питання при завантаженні сторінки
// loadQuestion(currentQuestionIndex);
let currentQuestionIndex = 1; // Індекс поточного питання
const totalQuestions = 6; // Загальна кількість питань

function loadQuestion(index) {
    if (index >= 1 && index <= totalQuestions) {
        const iframe = document.getElementById('questionContainer');
        iframe.src = `/html/location-questionnaire/question-${index}.html`;
    }
}

// Обробник для переходу до попереднього питання
document.querySelector('.left-arrow').addEventListener('click', function () {
    if (currentQuestionIndex > 1) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
});

// Обробник для переходу до наступного питання
document.querySelector('.right-arrow').addEventListener('click', function () {
    if (currentQuestionIndex < totalQuestions) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
});

// Завантажує перше питання при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    loadQuestion(currentQuestionIndex);
});
