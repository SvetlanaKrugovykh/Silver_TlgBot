const { Markup, Composer, Scenes } = require('telegraf');
const sendReqToDB = require('../modules/tlg_to_DB');

const startStep = new Composer();

startStep.on("text", async (ctx) => {
	try {
		await ctx.replyWithHTML("\n");
		return ctx.wizard.next();
	} catch (err) {
		console.log(err);
	}
});


const conditionStep = new Composer();
conditionStep.on("text", async (ctx) => {
	try {
		return ctx.scene.leave();
	} catch (err) {
		console.log(err);
	}
});

const receiptScene = new Scenes.WizardScene('authWizard', startStep, conditionStep);

module.exports = receiptScene;