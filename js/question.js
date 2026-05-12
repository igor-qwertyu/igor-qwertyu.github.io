/**
 * Количество баллов за отсутствие ответа
 * @type {Number}
 */
const POINTS_UNANSWERED = 0;
/**
 * Количество баллов за неверный ответ
 * @type {Number}
 */
const POINTS_INCORRECT = 0;
/**
 * Количество баллов за верный ответ
 * @type {Number}
 */
const POINTS_CORRECT = 1;

/** Вопрос */
class Question {
	/**
	 * Тип вопроса
	 * @type {QuestionType}
	 */
	type;
	/**
	 * Текст вопроса
	 * @type {String}
	 */
	text;
	/**
	 * Ответы
	 * @type {Array.<Answer>}
	 */
	answers;
	/**
	 * Сохранённый ответ
	 */
	#answer;

	/**
	 * Создать вопрос
	 * @param {QuestionType} type Тип вопроса
	 * @param {String} text Текст вопроса
	 * @param {Array.<Answer>} answers Ответы
	 * @returns {Test}
	 */
	constructor(type, text, answers) {
		this.type = type;
		this.text = text;
		this.answers = answers;
		this.viewed = false;
	}

	/**
	 * Показать выбор ответа
	 * @returns {String}
	 */
	render() {
		this.viewed = true;
		switch (this.type) {
			case "single":
				return this.answers.map((a, i) => `
					<input type="radio" value="${i}" value="${i}" id="c${i}" 
					 name="q">
					<label for="c${i}">${a[ANSWER_TEXT]}</label>
					<br>`).join("");
			case "multiple":
				return this.answers.map((a, i) => `
					<input type="checkbox" 
					id="c${i}"
					name="c${i}">
					<label for="c${i}">${a[ANSWER_TEXT]}</label>
					<br>`).join("");
			case "list":
				return `
					<select name="q">` + this.answers.map((a, i) => `
						<option value="${i}">${a[ANSWER_TEXT]}
					`).join("") + `</select>`;
			case "text":
				return `
					<input type="text" id="q">
				`;
			default:
				throw Error("Unknown type");
		}
	}

	/**
	 * Загрузить ответ из сохранённого значения
	 */
	load() {
		if (this.#answer === undefined) {
			if(this.type === "list")
				document.forms[0].q.value="";

			return;
		}

		switch (this.type) {
			case "single":
			case "list":
				document.forms[0].elements.q.value = this.#answer;
				break;
			case "multiple":
				this.#answer.forEach((v, i) => 
					document.forms[0][`c${i}`].checked = v);
				break;
			case "text":
				document.forms[0].q.value = this.#answer;
				break;
		}
	}

	save() {
		switch (this.type) {
			case "single": case "list": {
				const v = parseInt(document.forms[0].elements.q.value);
				if(!isNaN(v))
					this.#answer = v;
				break;
			}

			case "multiple": {
				/** @type Array.<Boolean> */
				const o = [];
				for(let i in this.answers)
					o.push(document.forms[0][`c${i}`].checked);
				if(!o.reduce( (a, v) => a || v, false))
					this.#answer = undefined;
				else
					this.#answer = o;
				break;
			}

			case "text": {
				const v = document.forms[0].q.value.trim();
				if(v)
					this.#answer = v;
				else
					this.#answer = undefined;
				break;
			}

			default:
				throw Error("Unknown type");
		}
	}

	/**
	 * Получить правильный ответ
	 * @returns {String}
	 */
	get correct() {
		switch(this.type){
			case "single":
			case "list":
				for (let a of this.answers)
					if (a[ANSWER_CORRECTNESS])
						return a[ANSWER_TEXT];
				return "";
			case "multiple": {
				const o = [];
				this.answers.forEach( (v, i) => {
					if(v[ANSWER_CORRECTNESS])
						o.push(this.answers[i][ANSWER_TEXT]);
				})
				return o;
			}
			case "text":
				return this.answers;
		}
	}

	/**
	 * Получить ответ заданный пользователем
	 * @returns {String}
	 */
	get answer() {
		if(this.#answer === undefined)
			return "";

		switch(this.type){
			case "single": case "list":
				return this.answers[this.#answer][ANSWER_TEXT];
			case "multiple": {
				const o = [];
				this.#answer.forEach((v, i) => {
					if(v)
						o.push(this.answers[i][ANSWER_TEXT]);
				});
				return o.join(", ");
			}
			case "text":
				return this.#answer;
		}
	}

	/**
	 * Сохранён ли ответ?
	 * @returns {Boolean}
	 */
	get saved() {
		return this.#answer !== undefined;
	}

	/**
	 * Сколько баллов даётся
	 * @return {Number}
	 */
	get points() {
		if (this.#answer === undefined)
			return POINTS_UNANSWERED;

		switch (this.type) {
			case "single": case "list":
				return this.answers[this.#answer][0]
					? POINTS_CORRECT
					: POINTS_INCORRECT;

			case "multiple":
				for (let i = 0; i < this.answers.length; i++)
					if (this.#answer[i] !== this.answers[i][0])
						return POINTS_INCORRECT;
				return POINTS_CORRECT;

			case "text":
				return this.#answer === this.answers
					? POINTS_CORRECT
					: POINTS_INCORRECT;
		}
	}
}