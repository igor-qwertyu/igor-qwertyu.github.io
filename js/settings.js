/**
 * Единицы времени 
 * @type Array.<number>
 */
const units = [60, 1];

/**
Переходит на страницу самого теста
@param {SubmitEvent} e - Событие при нажатии на кнопку "Начать тест"
**/
function begin(e) {
    e.preventDefault();

    const f = document.forms[0];
    sessionStorage.setItem("settings", JSON.stringify({
        shuffleQuestions: f.shq.checked,
        shuffleAnswers:   f.sha.checked,
        time: f.time.value.split(":").reduce((a, v, i) => a + v*units[i], 0)
    }));
    window.location.href = "test.html";
};