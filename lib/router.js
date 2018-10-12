var express = require.main.require('express');
var localRouter = express.Router();
var apiMiddleware = require.main.require("nodebb-plugin-write-api/routes/v2/middleware");
var categoryNotification = require('./categoryNotifications');

var Router = module.exports;

Router.init = function (params) {
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
}