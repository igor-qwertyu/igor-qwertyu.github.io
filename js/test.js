/**
 * Перемешивает массив
 * @param {Array} a Массив
 */
function shuffle(a) {
	let currentIndex = a.length;
	
	while (currentIndex !== 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		
		[a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]];
	}
}

/** 
 * Тип вопроса  
 * @typedef {("single"|"multiple"|"list"|"text")} QuestionType 
 */
/** 
 * Ответ 
 * @typedef {[Boolean, String]} Answer 
 */
/**
 * Ключ правильности ответа
 * @type {Number}
 */
const ANSWER_CORRECTNESS = 0;
/**
 * Ключ текста ответа
 * @type {Number}
 */
const ANSWER_TEXT = 1;
/**
 * Настройки
 * @typedef {Object} Settings
 * @property {Boolean} shuffleQuestions - Перемешивать ли вопросы
 * @property {Boolean} shuffleAnswers - Перемешивать ли ответы
 * @property {Number} time - Время на прохождение теста
 */
/**
 * Сереализованные данные вопроса
 * @typedef {Object} QuestionData
 * @property {QuestionType} type
 * @property {String} text
 * @property {Array.<Answer>} answers
 */

/** Тест */
class Test {
	/*
	 * Вопросы
	 * @type {Array.<Question>}
	 */
	questions;
	/**
	 * Текущий вопрос
	 * @type {Question}
	 */
	cur;
	/**
	 * Номер текущего вопроса
	 * @type {Number}
	 */
	curn;
	
	/**
	 * Создать тест
	 * @param {Settings} settings
	 * @param {Array.<QuestionData>} questions_data
	 */
	constructor(settings, questions_data){
		if (settings.shuffleQuestions)
			shuffle(questions_data);
		
		if (settings.shuffleAnswers)
			for (const q of questions_data)
				if (q.answers) 
					shuffle(q.answers);

		this.questions = questions_data.map((q) => {
			switch(q.type){
				case "single":
					return new Question("single", q.text, q.answers);
				case "multiple":
					return new Question("multiple", q.text, q.answers);
				case "list":
					return new Question("list", q.text, q.answers);
				case "text":
					return new Question("text", q.text, q.answers);
				default:
					throw SyntaxError("Unknown type");
			}
		});

		this.cur = this.questions[0];
		this.curn = 0;
		this.render();
		this.cur.load();

	}

	/**
	 * Перейти к вопросу
	 * @param {Number} n
	 */
	goto(n) {
		if(this.cur !== undefined)
			this.cur.save();

		this.cur = this.questions[n];
		this.curn = n;
		this.render();
		this.cur.load();

		this.buttons();
	}

	/**
	 * Перерисовывает меню
	 */
	render() {
		document.getElementById("qnum").innerText = this.curn + 1;
		document.getElementById("question").innerText = this.cur.text;
		document.getElementById("answers").innerHTML = this.cur.render();

		this.buttons();
	}
	
	/**
	 * Заверишть тест
	 */
	finish() {
		this.cur.save();
		sessionStorage.setItem("result", JSON.stringify(
			this.questions.map( (a) => {return{
				question: a.text,
				answer:   a.answer,
				correct:  a.correct,
				points:   a.points
			};}
		)));

		window.location.href = "result.html";
	}

	/**
	 * Нарисовать кнопки
	 */
	buttons() {
		document.getElementById("buttons")
				.innerHTML = this.questions.map( (q, i) => `
			<button class="${
			q.viewed
				? (q.saved ? "answered" : "viewed")
				: "unviewed"} ${i === this.curn ? "current":"" }"
			onclick="main.goto(${i})">${i + 1}</button>
			`).join(" ");
	}
}