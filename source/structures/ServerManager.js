let express = require('express'),
  cors =  require('cors'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('cookie-session'),
  logger = require('morgan'),
  jsonParser = express.json(),
  tls = require('tls'),
  fs = require('fs');


class ServerManager{
	constructor(){
		this.certs = {
		    "api.catalogserverov.xyz":{
		        key: '/etc/letsencrypt/live/api.catalogserverov.xyz/privkey.pem', 
		        cert: '/etc/letsencrypt/live/api.catalogserverov.xyz/cert.pem',
		        ca: '/etc/letsencrypt/live/api.catalogserverov.xyz/fullchain.pem'
		    },
		    "catalogserverov.xyz":{
		        key: `/etc/letsencrypt/live/catalogserverov.xyz-0001/privkey.pem`,
		        cert: '/etc/letsencrypt/live/catalogserverov.xyz-0001/cert.pem',
		        ca: '/etc/letsencrypt/live/catalogserverov.xyz-0001/fullchain.pem'
		    },
		    "wiki.catalogserverov.xyz":{
		        key: '/etc/letsencrypt/live/catalogserverov.xyz/privkey.pem',
		        cert: '/etc/letsencrypt/live/catalogserverov.xyz/cert.pem',
		        ca: '/etc/letsencrypt/live/catalogserverov.xyz/fullchain.pem'
		    },
		}
		this.app = express()
		this.app.usersActivity = {};
	}
	getSecureContexts(certs) {
	    if (!certs || Object.keys(certs).length === 0) throw new Error("Сертификат не был найден");
	    const certsToReturn = {};
	    for (const serverName of Object.keys(certs)) {
	      const appCert = certs[serverName];
	      certsToReturn[serverName] = tls.createSecureContext({
	        key: fs.readFileSync(appCert.key),
	        cert: fs.readFileSync(appCert.cert),
	        ca: appCert.ca ? this.sslCADecode(
	          fs.readFileSync(appCert.ca, "utf8"),
	        ) : null,
	      }); 
	    }
	    return certsToReturn;
	}
	sslCADecode(source) {
	    if (!source || typeof (source) !== "string") {
	        return [];
	    }
	    return source.split(/-----END CERTIFICATE-----[\s\n]+-----BEGIN CERTIFICATE-----/)
	        .map((value, index, number, array) => {
	        if (index) {
	            value = "-----BEGIN CERTIFICATE-----" + value;
	        }
	        if (index !== (array?.length||1) - 1) {
	            value = value + "-----END CERTIFICATE-----";
	        }
	        value = value.replace(/^\n+/, "").replace(/\n+$/, "");
	        return value;
	    });
	}
	_setup(){
		const secureContexts = this.getSecureContexts(this.certs)
		this.options = {
		    SNICallback: (servername, cb) => {
		        const ctx = secureContexts[servername];
		        if (cb) cb(null, ctx);
		        else return ctx;
		    }
		}
		global.app = this.app
		this.app.set('views', require('path').join(__dirname, '../web'))
		.set('view engine','ejs')
		.use(express.static(require('path').join(__dirname, '../public')))
		.use(logger('dev'))
		.use(require('cors')())
		.use(express.json())
		.use(express.urlencoded({ extended: false }))
		.use(cookieParser())
		.use(bodyParser.urlencoded({ extended: true }))
		.use(cors())
		.use(session({secret: "catalog",cookie: { maxAge: 60000 * 60 * 24 * 7 }})).use(function (req, res, next) {
		app.usersActivity[req.sessionID] = new Date().getTime();
		next();
		})
		.use(function(req,res,next){
		  res.header("Access-Control-Allow-Origin", "*");
  		  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  		  next();
		});
		this.application = require('http').createServer(this.app);
		this.application.listen(8081, () => {console.log(`API ready.`)});
		this._setEndpoints()
	}
	fetchDirs(dir) {
	    var results = [];
	    fs.readdirSync(dir).forEach((file) =>{
	        file = dir+'/'+file;
	        var stat = fs.statSync(file);
	        if (stat && stat.isDirectory()) {
	            results = results.concat(this.fetchDirs(file))
	        } else results.push(file);
	    });
	    return results;
	};
	async _setEndpoints(){
		let dirs = this.fetchDirs('./source/api'),
			dirs2 = this.fetchDirs('./source/api2'),
			endpoints = 1;
		app.get('*', function(req, res, next){
			if(!['api.catalogserverov.xyz','wiki.catalogserverov.xyz'].includes(req.headers.host) && (!['/dashboard','/oauth2','/search2','/app-assets','/assets','/guild2','/emojis','/search_test'].includes("/"+req.url.split("?")[0]?.split("/")[1]))) return res.render('comingsoon')
		  switch(req.headers.host){
		    case 'social.catalogserverov.xyz': req.url = '/social' + req.url; break;
		    case 'wiki.catalogserverov.xyz': req.url = '/wiki' + req.url; break;
		    case 'api.catalogserverov.xyz': req.url = '/api' + req.url; break;
		  }
		  next(); 
		});
		app.post('*', function(req, res, next){ 
		  switch(req.headers.host){
		    case 'social.catalogserverov.xyz': req.url = '/social' + req.url; break;
		    case 'wiki.catalogserverov.xyz': req.url = '/wiki' + req.url; break;
		    case 'api.catalogserverov.xyz': req.url = '/api' + req.url; break;
		  }
		  next(); 
		});
		dirs.reverse().forEach(async dir=>{
			app.get(`/${dir.split("/").slice(2).join("/").slice(0,-3)}/${require(`..${dir.slice('./source'.length)}`).attr}`,require(`..${dir.slice('./source'.length)}`).execute)
			endpoints++
		})
		dirs2.reverse().forEach(async dir=>{
			app.post(`/${dir.split("/").slice(2).join("/").slice(0,-3).replace("api2","api")}/${require(`..${dir.slice('./source'.length)}`).attr}`,require(`..${dir.slice('./source'.length)}`).execute)
			endpoints++
		})
		console.log(`API: ${endpoints} endpoints.`)
		let files = require('fs').readdirSync('./source/web_index').filter(f=>f.endsWith('.js'))
		files.map(file=>app.get(`${require(`../web_index/${file}`).url||""}/${(require(`../web_index/${file}`).name||file.slice(0,-3)).replace('index','')}${require(`../web_index/${file}`).attr?`/${require(`../web_index/${file}`).attr}`:""}`,require(`../web_index/${file}`).execute))

		let files2 = require('fs').readdirSync('./source/web_index/post')
		files2.map(file=>app.post(`${require(`../web_index/post/${file}`).url||""}/${(require(`../web_index/post/${file}`).name||file.slice(0,-3)).replace('index','')}${require(`../web_index/post/${file}`).attr?`/${require(`../web_index/post/${file}`).attr}`:""}`,require(`../web_index/post/${file}`).execute))
		console.log(`Web: ${files.length} pages.`)
	}
}
module.exports = ServerManager
