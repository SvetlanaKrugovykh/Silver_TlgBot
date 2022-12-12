//'use strict'

require('dotenv').config();
const axios = require(`axios`);
const { Telnet } = require('telnet-client');
const { MArkup, Composer, Scenes } = require('telegraf');
const sendReqToDB = require('../modules/tlg_to_DB');
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const { cli, devices } = require('./data/cli.model');


let params = {
	host: '127.0.0.1',
	port: 23,
	shellPrompt: '/ # ', // or negotiationMandatory: false
	timeout: 1500
};



const startStep = new Composer();
startStep.on("text", async (ctx) => {
	try {
		infoFound = false;
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
					params.host = response.data.split(',')[9];
					params.username = devices.find(device => device.ip == params.host).username;
					params.password = devices.find(device => device.ip == params.host).password;
					//let cmd = cli.find(command => command.commandTlg == inputLine).commandEqv;
					//console.log('cmd:', cmd);

					params.password = response.data.split(',')[11];
					connection.connect(params)
						.then(prompt => {
							connection.exec(cmd)
								.then(res => {
									console.log('promises result:', res);
								});
						}, error => {
							console.log('promises reject:', error);
						}).catch(error => {
							console.log('catch error:', error);
						});

					ctx.replyWithHTML(`🥎\n ${res}.\n`);

				}
			})
			.catch((err) => {
				ctx.replyWithHTML(`⛔️Жодної інформації за запитом не знайдено`);
				return ctx.scene.leave();
			})
			.then(() => {
				ctx.replyWithHTML("👋💙💛 Have a nice day!\n");
			});
	} catch (err) {
		console.log(err);
	}
});


const netwareAdminScene = new Scenes.WizardScene('netwareAdminWizard', startStep, conditionStep));

module.exports = netwareAdminScene;

