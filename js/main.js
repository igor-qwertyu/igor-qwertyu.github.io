/**
 * Секунда в милисекундах
 * @type Number
 */
const SECOND_MS = 1000;
/**
 * Минута в секундах
 * @type Number
 */
const MINUTE = 60;
/**
 * Количество символов в минуте / секунде
 * @type Number
 */
const DIGITS = 2;
/**
 * Запустить таймер
 * @param {Number} time
 */
function timer(time) {
    let timeLeft = time;

    const remaining = document.getElementById("remaining");
    const updateTime = () => {
        remaining.innerText = `${
            String((timeLeft / MINUTE) | 0).padStart(DIGITS, "0")}:${
            String(timeLeft % MINUTE).padStart(DIGITS, "0")
        }`;
        if (timeLeft <= 0)
            main.finish();
        else
            setTimeout(updateTime, SECOND_MS)
        timeLeft--;
    }
    updateTime();
}

/** @typedef {[Boolean, String]} Answer Ответ */
/**
 * Сереализованный данные вопроса
 * @typedef {Object} QuestionData
 * @property {"single"|"multiple"|"list"|"text"} type Тип вопроса
 * @property {String} text Текст вопроса
 * @property {Array.<Answer>} answers Ответы на вопрос
 */
/**
 * Настройки
 * @typedef {Object} Settings
 * @property {Boolean} shuffleQuestions - Перемешивать ли вопросы
 * @property {Boolean} shuffleAnswers - Перемешивать ли ответы
 * @property {Number} time - Время на прохождение теста
 */
/**
 * Настройки полученные от предыдущей страницы
 * @type {Settings}
 */
const settings = JSON.parse(sessionStorage.getItem("settings"));

// Если нет настроек
if(settings == null)
    window.location.href = ".";

// Предотвращение возвращения на эту страницу
window.addEventListener("pageshow", (e) => {
    if (e.persisted)
        location.replace(".");
});

/**
 * Состояние теста
 * @type {Test}
 */
let main;

window.addEventListener('load', async () => {
    const response  = await fetch("db/questions.json");
    const questions = await response.json();

    timer(settings.time);
    main = new Test(settings, questions);
});