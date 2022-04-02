let rp = require('request-promise')
module.exports = {
	"url":"/wiki",
	"name":"oauth2",
	"attr":"",
	execute: async(req,res)=>{
  if(req.query.action === 'out') {delete req.session.uid;res.redirect('/');}
  if (req.query.redir && !req.session.redir) req.session.redir = req.query.redir
  if (!req.query.code)
    return res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=817749615667445790&redirect_uri=https://wiki.catalogserverov.xyz/oauth2&response_type=code&scope=identify%20guilds.join%20guilds&prompt=none`
    )
  rp({
    uri: 'https://discordapp.com/api/v9/oauth2/token',
    method: 'POST',
    form: {
      client_id: '817749615667445790',
      client_secret: config.web.client_secret,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: `https://wiki.catalogserverov.xyz/oauth2`,
      scope: 'identify guilds guilds.join'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  }).then(async result => {
    req.session.token = result.access_token;
    rp({
      method: 'GET',
      url: 'https://discordapp.com/api/v9/users/@me',
      headers: {
        Authorization: `Bearer ${result.access_token}`
      },
      json: true
    }).then(async user => {
      req.session.uid = user.id;
      if (req.session.redir) {
        await res.redirect(req.session.redir)
        req.session.redir = null
      }
      res.redirect('https://wiki.catalogserverov.xyz/');
    }).catch(e => {console.log(e);res.redirect("/")})
  }).catch(e => {console.log(e);res.redirect("/")});
}}