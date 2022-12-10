require('dotenv').config();
const { MArkup, Composer, Scenes } = require('telegraf');
const axios = require(`axios`);
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const startStep = new Composer();

startStep.on("text", async (ctx) => {
	try {
		let htmlText = "Введіть <i>номер телефону </i> або <i>адресу через # </i>, що є в договорі на абонентське обслуговування.\nТакож формат для відправки відповіді по id клієнта #id...id...#id...відповідь...\n";
		await ctx.replyWithHTML(htmlText);
		return ctx.wizard.next();
	} catch (err) {
		console.log(err);
	}
});

const conditionStep = new Composer();
conditionStep.on("text", async (ctx) => {
	try {
		let inputLine = ctx.message.text;
		if (inputLine.includes("id#")) {
			let id = inputLine.split("id#")[1];
			let msgtext = inputLine.split("id#")[2];
			console.log(msgtext);
			try {
				ctx.telegram.sendMessage(id, `Дякуємо за звернення, відповідь: \n ${msgtext}`);
				return ctx.scene.leave();
			} catch (err) {
				console.log(err);
				return ctx.scene.leave();
			}
		}
		console.log('inputLine:', inputLine);
		axios({
			method: 'post',
			url: URL,
			responseType: 'string',
			headers: {
				Authorization: `${AUTH_TOKEN}`,
				'Content-Type': 'application/json',
			},
			data: {
				Query: `Execute;__GetClientsInfo__;${inputLine};КОНЕЦ`,
			}
		})
			.then((response) => {
				if (!response.status == 200) {
					ctx.replyWithHTML(`⛔️Ніякої інформації за запитом не знайдено`);
					return ctx.scene.leave();
				} else {
					let answer = response.data.toString();
					console.log(answer);
					ctx.replyWithHTML(`🥎\n ${answer}.\n`);
				}
			})
			.catch((err) => {
				ctx.replyWithHTML(`⛔️Жодної інформації за запитом не знайдено`);
				return ctx.scene.leave();
			})
			.then(() => {
				ctx.replyWithHTML("👋💙💛 Have a nice day!\n");
			});
		return ctx.scene.leave();
	} catch (err) {
		console.log(err);
	}
});

const clientsAdminScene = new Scenes.WizardScene('clientsAdminWizard', startStep, conditionStep);

module.exports = clientsAdminScene;