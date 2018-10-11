'use strict';

var routes = require('./routes');
var categoryNotification = require('./categoryNotifications');
var apiMiddleware = require("nodebb-plugin-write-api/routes/v2/middleware")
var express = require('express');

var library = module.exports;

library.init = function(params, callback) {
	var localRouter = express.Router();
	var middleware = params.middleware;

	localRouter.post('/user/:uid/category/:cid/follow', apiMiddleware.requireUser, apiMiddleware.requireAdmin, apiMiddleware.validateCid, function(req, res) {
		categoryNotification.subscribe(req.params.uid, req.params.cid, function (err) {
			res.status(200).json({
				code: 'ok',
				message: 'Following category: ' + req.params.cid,
				params: {}
			});
		});
	});

	localRouter.delete('/user/:uid/category/:cid/follow', apiMiddleware.requireUser, apiMiddleware.requireAdmin, apiMiddleware.validateCid, function(req, res) {
		categoryNotification.unsubscribe(req.params.uid, req.params.cid, function (err) {
			res.status(200).json({
				code: 'ok',
				message: 'Unfollwed category: ' + req.params.cid,
				params: {}
			});
		});
	});

	params.router.use('/api/v2.1', localRouter);

	require('./websockets');
	routes.init(params, callback);
};

library.adminMenu = function(menu, callback) {
	menu.plugins.push({
		route: '/plugins/category-notifications',
		icon: 'fa-pencil',
		name: 'Category Notifications'
	});

	callback(null, menu);
};

library.onTopicPost = function(data) {
	categoryNotification.onTopicPost(data.topic);
};

library.onTopicReply = function(data) {
	categoryNotification.onTopicReply(data.post);
};

library.onUserDelete = function (data) {
	categoryNotification.onUserDelete(data);
};


