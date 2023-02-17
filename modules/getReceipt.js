const axios = require(`axios`);
const fs = require('fs');
const URL = process.env.URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

async function getReceipt(telNumber, ctx) {
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
        setTimeout(function () { }, 9999);
        console.log('response.status', response.status);
        let fileFullName = `C:\\Temp\\__${ctx.chat.id}__.pdf`;
        if (!response.status == 200) {
            ctx.replyWithHTML(`⛔️За номером ${telNumber} даних не існує.\nВи можете надіслати своє питання в службу технічної підтримки.\n`);
            return ctx.scene.leave();
        } else {
            response.data.pipe(fs.createWriteStream(fileFullName));
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
        console.log(err);
        ctx.replyWithHTML(`⛔️За номером ${telNumber} даних не існує.\nВи можете надіслати своє питання в службу технічної підтримки.\n`);
        return ctx.scene.leave();
    })
    .then(() => {
        ctx.replyWithHTML("👋💙💛 Дякуємо за звернення.\n");
    });
}

module.exports = { getReceipt };