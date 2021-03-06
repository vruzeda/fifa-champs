"use strict"

const util = require('./utils');
const bodyParser  = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const uuid = require('uid-safe');
const cors = require('cors');

const errors = require('./errors');
const utils = require('./utils');

const URL_CHAMPIONSHIPS = "/api/championships";
const URL_PLAYERS = "/api/players";
const URL_MATCHES = "/api/matches";
const URL_LOGIN = "/api/login";
const URL_LOGOUT = '/api/logout';

const ChampionshipController = require('./controllers/championshipController');
const PlayerController = require('./controllers/playerController');
const MatchController = require('./controllers/matchController');
const AdminController = require('./controllers/adminController');

exports.set = function(app, mongo) {
	
	const championshipController = new ChampionshipController(mongo);
	const playerController = new PlayerController(mongo);
	const matchController = new MatchController(mongo);
	const adminController = new AdminController(mongo);
	
	require('./passport')(passport, adminController);

	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	app.use(bodyParser.json());

	app.use(cors({
		origin: function (origin, callback) {
		    callback(null, true); //bypass
		},
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		preflightContinue: false,
		credentials: true,
		optionsSuccessStatus: 204,
		allowedHeaders: ['set-cookie', 'Content-Type', 'cookie', 'cookies', 'connect.sid'],
		exposedHeaders: ['set-cookie', 'Content-Type', 'cookie', 'cookies', 'connect.sid']
	}));
	
	app.options('*', cors());

	app.use(cookieParser());

	app.use(session({
		secret: 'SEKR37',
		resave: false,
		saveUninitialized: true,
		cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: false }
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	adminController.getAll().then((admins) => {
		if (admins.length == 0) {
			return adminController.insert({nickname: 'Admin', password: '71e3401a5fdf0203d345362e003636b8'});
		}
	}).then((admin) => {
		if (admin) {
			console.log("Created Admin: " + admin.nickname);
		}
	});

	function isLoggedIn(req, res, next) {

	    if (req.isAuthenticated()) {
	        return next();
	    }

	    res.status(401).send(errors.getUnauthorized());
	}

	//LOGIN
	app.post(URL_LOGIN, (request, response, next) => {
		passport.authenticate('local-login', (error, user, info) => {
			
			if (error) {
				response.status(401).send(error);
				return;
			}

			request.login(user, (error) => {
				
				if (error) {
					response.status(401).send(error);
					return;
				}
				response.send(user);
				next();
			});
		})(request, response, next);
	});

	app.post(URL_LOGOUT, (req, res) => {
        req.logout();
        res.send(true);
    });

	//Championships
	app.get(URL_CHAMPIONSHIPS, (request, response) => {

		var promise = null;
		if (request.query) {
			promise = championshipController.getByCriteria(request.query);
		} else {
			promise = championshipController.getAll()
		}
		
		promise.then((championshipsList) => {
			response.send(championshipsList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.get(URL_CHAMPIONSHIPS + "/:id", (request, response) => {
		var id = request.params.id;
		championshipController.getById(id).then((championshipsList) => {
			response.send(championshipsList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_CHAMPIONSHIPS, isLoggedIn, (request, response) => {
		championshipController.insert(request.body).then((championship) => {
			response.send(championship);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_CHAMPIONSHIPS + "/:id", isLoggedIn, (request, response) => {
		var id = request.params.id;

		console.log(id);
		console.log(request.body);

		championshipController.update(id, request.body).then((championship) => {
			response.send(championship);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.delete(URL_CHAMPIONSHIPS + "/:id", isLoggedIn, (request, response) => {
		var id = request.params.id;
		championshipController.delete(id).then((result) => {
			response.send(result);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	//Players
	app.get(URL_PLAYERS, (request, response) => {
		playerController.getAll().then((playersList) => {
			response.send(playersList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_PLAYERS, isLoggedIn, (request, response) => {
		playerController.insert(request.body).then((player) => {
			response.send(player);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_PLAYERS + "/:id", isLoggedIn, (request, response) => {
		var id = request.params.id;
		playerController.update(id, request.body).then((player) => {
			response.send(player);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.delete(URL_PLAYERS + "/:id", isLoggedIn, (request, response) => {
		var id = request.params.id;
		playerController.delete(id).then((result) => {
			response.send(result);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	//Matches
	app.get(URL_MATCHES, (request, response) => {
		var promise = null;
		if (request.query) {
			promise = matchController.getByCriteria(request.query);
		} else {
			promise = matchController.getAll()
		}

		promise.then((matchesList) => {
			response.send(matchesList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.get(URL_MATCHES + "/:championshipId", (request, response) => {
		var championshipId = request.params.championshipId;
		matchController.getByChampionship(championshipId).then((matchesList) => {
			response.send(matchesList);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_MATCHES, isLoggedIn, (request, response) => {
		matchController.insert(request.body).then((match) => {
			response.send(match);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.post(URL_MATCHES + "/:id", isLoggedIn, (request, response) => {
		var id = request.params.id;
		matchController.update(id, request.body).then((match) => {
			response.send(match);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});

	app.delete(URL_MATCHES + "/:id", isLoggedIn, (request, response) => {
		var id = request.params.id;

		matchController.delete(id).then((result) => {
			response.send(result);
		}).catch((error) => {
			response.status(500).send(error);
		});
	});
};