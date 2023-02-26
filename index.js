require('dotenv').config();
const axios = require("axios");
const { Telegraf, Scenes, session } = require("telegraf");

const { guestStartButtons, adminStartButtons, authStartButtons } = require('./modules/keyboard');
const { users } = require('./users/users.model');

const receiptScene = require('./controllers/receipt');
const authScene = require('./controllers/auth');
const supportScene = require('./controllers/support');
const netwareAdminScene = require('./controllers/netwareAdmin');
const clientsAdminScene = require('./controllers/clientsAdmin');

const sendReqToDB = require('./modules/tlg_to_DB');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const stage = new Scenes.Stage([
	receiptScene,
	authScene,
	supportScene,
	netwareAdminScene,
	clientsAdminScene
]);

bot.use(session());
bot.use(stage.middleware());

bot.hears('Отримати рахунок', ctx => ctx.scene.enter('receiptWizard'));
bot.hears('Надіслати повідомлення', ctx => ctx.scene.enter('supportWizard'));
bot.hears('Netware support', ctx => ctx.scene.enter('netwareAdminWizard'));
bot.hears('Clients support', ctx => ctx.scene.enter('clientsAdminWizard'));

bot.start(async (ctx) => {
	console.log(new Date());
	console.log(ctx.chat);
	const adminUser = users.find(user => user.id === ctx.chat.id);
	if (!adminUser) {
		try {
			const autorized = await sendReqToDB('__CheckTlgClient__', ctx.chat, '');
			if (autorized) {
				await ctx.replyWithHTML(`Чат-бот <b>ISP SILVER-SERVICE</b> вітає Вас, <b>${ctx.chat.first_name} ${ctx.chat.last_name}</b>!
Вам надано авторизований доступ`);
				await ctx.reply("Оберіть, будь ласка, дію", authStartButtons);
			} else {
				await ctx.replyWithHTML(`Чат-бот <b>ISP SILVER-SERVICE</b> вітає Вас, <b>${ctx.chat.first_name} ${ctx.chat.last_name}</b>!
Вам надано гостьовий доступ`);
				await ctx.reply("Оберіть, будь ласка, дію", guestStartButtons);
			}
		} catch (err) {
			console.log(err);
		}
	} else {
		try {
			await ctx.reply(`Hi, ${ctx.chat.first_name} ${ctx.chat.last_name}!
You have been granted administrative access`);
			await ctx.reply("Choose an action", adminStartButtons);
		} catch (err) {
			console.log(err);
		}
	}
});

bot.startPolling();

