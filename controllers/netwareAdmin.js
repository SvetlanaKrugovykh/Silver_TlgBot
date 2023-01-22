//'use strict'

require('dotenv').config();
const axios = require(`axios`);
const { MArkup, Composer, Scenes } = require('telegraf');
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const { cli, devices } = require('../data/cli.model');
const telnetCall = require('../modules/telnet');

const startStep = new Composer();
startStep.on("text", async (ctx) => {
	try {
		let htmlText = "Введіть <i>номер телефону </i> або <i>адресу через # </i>, що є в договорі на абонентське обслуговування.\nТа команду, що необхідно виконати...\n";
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
		console.log('inputLine:', inputLine);
		console.log(((new Date()).toLocaleTimeString()));
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
					ctx.replyWithHTML(`🥎\n ${response.data.toString()}.\n`);
					let responseData = JSON.parse(response.data);
					if (responseData.ResponseArray[0].HOST) {
						const HOST = responseData.ResponseArray[0].HOST;
						console.log(HOST);
						let match = responseData.ResponseArray[0].Comment.match(/^\w+\/\d+:\d+/);
						if (match) {
							const comment = match[0];
							console.log(comment);
							telnetCall(HOST, comment)
								.then(store => {
									console.dir(store);
									ctx.replyWithHTML(`🥎\n ${store.toString()}.\n`);
								})
								.catch(err => {
									console.log(err);
								});
						}
					}

				}
			})
			.catch((err) => {
				ctx.replyWithHTML(`⛔️Жодної інформації за запитом не знайдено`);
				return ctx.scene.leave();
			})
			.then(() => {
				ctx.replyWithHTML(`👋💙💛 Have a nice day!\n`);
			});
	} catch (err) {
		console.log(err);
	}
});


const netwareAdminScene = new Scenes.WizardScene('netwareAdminWizard', startStep, conditionStep);

module.exports = netwareAdminScene;


