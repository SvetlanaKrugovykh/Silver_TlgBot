
const { Markup, Composer, Scenes } = require('telegraf');
const axios = require(`axios`);
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const sendReqToDB = require('../modules/tlg_to_DB');

const startStep = new Composer();
startStep.on("text", async (ctx) => {
	try {
		await ctx.replyWithHTML("<i> Залиште нижче текстове повідомлення для служби технічної підтримки.\n Прохання вказати номер телефону та як нам зручніше з Вами зв'язатись</i>");
		return ctx.wizard.next();
	} catch (err) {
		console.log(err);
	}
});

const conditionStep = new Composer();
conditionStep.on("text", async (ctx) => {
	try {
		ctx.telegram.sendMessage('@m_yDgK8imz0zNzYy',
			`Звернення від ${ctx.message.from.first_name} ${ctx.message.from.last_name} id ${ctx.chat.id} username ${ctx.chat.username}` +
			`\n` + ctx.message.text);
		sendReqToDB('__SaveTlgMsg__', ctx.chat, ctx.message.text);
		await ctx.replyWithHTML(`Дякую! Ваше повідомлення надіслано.\n Чекайте на відповідь протягом 30 хвилин`);
		return ctx.scene.leave();
	} catch (err) {
		console.log(err);
	}
});

const supportScene = new Scenes.WizardScene('supportWizard', startStep, conditionStep);


module.exports = supportScene;


