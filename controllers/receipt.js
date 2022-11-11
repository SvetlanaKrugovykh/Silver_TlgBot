const { Markup, Composer, Scenes } = require('telegraf');
const axios = require(`axios`);
const fs = require('fs');
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const sendReqToDB = require('../modules/tlg_to_DB');

const startStep = new Composer();

startStep.on("text", async (ctx) => {
	try {
		await ctx.replyWithHTML("Введіть <i>номер телефону </i>, який вказано в договорі на абонентське обслуговування\n");
		return ctx.wizard.next();
	} catch (err) {
		timeStmp();
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
			axios({
				method: 'post',
				url: URL,
				responseType: 'stream',
				headers: {
					Authorization: `${AUTH_TOKEN}`,
					'Content-Type': 'application/json',
				},
				data: {
					Query: `Execute;GetReceipt;${telNumber};КОНЕЦ`,
				}
			})
				.then((response) => {
					let fileFullName = `C:\\Temp\\__${ctx.chat.id}__.pdf`;
					if (!response.status == 200) {
						ctx.replyWithHTML(`⛔️За номером ${telNumber} даних не існує.\nВи можете надіслати своє питання в службу технічної підтримки.\n`);
						return ctx.scene.leave();
					} else {
						response.data.pipe(fs.createWriteStream(fileFullName));
						timeStmp();
						console.log(`File ${fileFullName} saved.`);
						setTimeout(function () { }, 9999);
						ctx.replyWithHTML("🥎Рахунок отримано.\n");
						setTimeout(function () {
							ctx.telegram.sendDocument(ctx.from.id, {
								source: fileFullName
							}).catch(function (error) { console.log(error); });
						}, 1000);
					}
				})
				.catch((err) => {
					ctx.replyWithHTML(`⛔️За номером ${telNumber} даних не існує.\nВи можете надіслати своє питання в службу технічної підтримки.\n`);
					return ctx.scene.leave();
				})
				.then(() => {
					ctx.replyWithHTML("👋💙💛 Дякуємо за звернення.\n");
				});
		};
		return ctx.scene.leave();
	} catch (err) {
		timeStmp();
		console.log(err);
	}
});

const receiptScene = new Scenes.WizardScene('receiptWizard', startStep, conditionStep);

module.exports = receiptScene;
