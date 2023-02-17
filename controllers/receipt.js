const { Markup, Composer, Scenes } = require('telegraf');
const axios = require(`axios`);
const fs = require('fs');
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const sendReqToDB = require('../modules/tlg_to_DB');
const { getReceipt } = require('../modules/getReceipt');

const startStep = new Composer();

startStep.on("text", async (ctx) => {
	try {
		await ctx.replyWithHTML("Введіть <i>номер телефону </i>, який вказано в договорі на абонентське обслуговування\n");
		return ctx.wizard.next();
	} catch (err) {
		console.log(err);
	}
});


const conditionStep = new Composer();
conditionStep.on("text", async (ctx) => {
	try {
		let telNumber = ctx.message.text.replace(/[^0-9]/g, "");
		console.log(new Date());
		console.log('Tel№:', telNumber);
		sendReqToDB('__SaveTlgMsg__', ctx.chat, telNumber);
		if (telNumber.length < 7 || telNumber.length > 12) {
			await ctx.replyWithHTML("😡Номер телефону введено помилково\nСеанс завершено.");
			return ctx.scene.leave();
		} else {
			getReceipt(telNumber, ctx);
		};
		return ctx.scene.leave();
	} catch (err) {
		console.log(err);
	}
});

const receiptScene = new Scenes.WizardScene('receiptWizard', startStep, conditionStep);

module.exports = receiptScene;
