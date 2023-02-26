const { Markup, Composer, Scenes } = require('telegraf');

const webAppUrl = process.env.WEB_APP_URL;
const webAppToken = process.env.WEB_APP_TOKEN;

const startStep = new Composer();

startStep.on("text", async (ctx) => {
	try {
		await ctx.reply('Нижче з\'явиться кнопка, заповніть форму', {
			reply_markup: {
				keyboard: [
					[{ text: 'Заповніть форму', url: webAppUrl + '/form' }]
				],
				resize_keyboard: true
			}
		});
	} catch (err) {
		console.log(err);
	}
});


const conditionStep = new Composer();
conditionStep.on("text", async (ctx) => {
	if (ctx.callbackQuery?.data) {
		try {
			const data = JSON.parse(ctx.callbackQuery?.data);
			console.log(data);
			await ctx.reply('Дякуємо за зворотний зв\'язок!');
			//		await ctx.reply('Ваша страна: ' + data?.country);
			setTimeout(async () => {
				await ctx.reply('Необхідну інформацію ви отримаєте в цьому чаті');
			}, 3000)
		} catch (e) {
			console.log(e);
		}
	}
});

const receiptScene = new Scenes.WizardScene('authWizard', startStep, conditionStep);

module.exports = receiptScene;