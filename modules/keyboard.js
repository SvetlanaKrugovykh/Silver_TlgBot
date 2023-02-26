const { Markup } = require('telegraf');

const guestStartButtons = Markup.keyboard([
	['Отримати рахунок',
		'Надіслати повідомлення',
		'Зареєструватися']
]).oneTime().resize();

const authStartButtons = Markup.keyboard([
	['Отримати рахунок',
		'Надіслати повідомлення']
]).oneTime().resize();

const adminStartButtons = Markup.keyboard([
	['Netware support',
		'Clients support']
]).oneTime().resize();

module.exports = { guestStartButtons, adminStartButtons, authStartButtons };

