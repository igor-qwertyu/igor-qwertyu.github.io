const data = JSON.parse(sessionStorage.getItem("result"));

/**
 * Количество набранных баллов
 * @type {Number}
 */
let points = 0;

window.addEventListener('load', () => {
    document.getElementById("result").innerHTML = `
        <tr>
            <th>№</th>
            <th>Вопрос</th>
            <th>Ответ пользователя</th>
            <th>Правильный ответ</th>
            <th>Баллы</th>
        </tr>
        ${
            data.map( (a, v) => `
                <tr class="${ a.points > 0 ? "correct" : "incorrect"}">
                    <td>${v+1}</td>
                    <td>${a.question}</td>
                    <td>${a.answer || "(Ответ не дан)"}</td>
                    <td>${a.correct}</td>
                    <td>${points+=a.points, a.points}</td>
                </tr>
            ` ).join("")
        }
    `;
    document.getElementById("points")
            .innerText =`Балы ${points}/${data.length}`;
});