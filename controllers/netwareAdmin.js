const { MArkup, Composer, Scenes } = require('telegraf');

const startStep = new Composer();
startStep.on( "text", async (ctx) => {
 try {
    ctx.wizard.stage.data = {}; 
    ctx.wizard.stage.data.username = ctx.message.from.username;
    ctx.wizard.stage.data.firstname = ctx.message.from.first_name;
    ctx.wizard.stage.data.lastname = ctx.message.from.last_name;
    await ctx.replyWithHTML("Hi!\n");
 } catch (err) {
    console.log(err);
 }
});

const netwareAdminScene = new Scenes.WizardScene('netwareAdminWizard', startStep);

module.exports = netwareAdminScene;

