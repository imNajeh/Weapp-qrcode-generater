'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');

class GenerateController extends Controller {
  async code() {
    const ctx = this.ctx;
    const { appid, secret, path } = ctx.request.body;
    const time = new Date().getTime();
    const s = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`);
    const result = JSON.parse(s.data.toString());
    await ctx.curl(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${result.access_token}`, {
      method: 'POST',
      contentType: 'json',
      data: {
        access_token: result.access_token,
        path,
      },
      writeStream: fs.createWriteStream(`./app/public/code/${time}.png`),
    });
    await ctx.render('code.nj', { img: `public/code/${time}.png` });
  }
}

module.exports = GenerateController;
