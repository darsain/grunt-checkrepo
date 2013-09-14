/*
 * grunt-checkrepo
 * https://github.com/Darsain/grunt-checkrepo
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
'use strict';

var shell  = require('shelljs');
var semver = require('semver');

/**
 * Execute a shell command.
 *
 * @param  {String} command
 *
 * @return {Object}
 */
function exec(command) {
	return shell.exec(command, { silent: true });
}

/**
 * Git convenience methods.
 *
 * @type {Object}
 */
var git = {
	getHighestTag: function () {
		var highestTag = '0.0.0';
		var tags = exec('git tag');

		if (tags.code !== 0) {
			return highestTag;
		}

		tags = tags.output.split('\n');
		tags.forEach(function (tag) {
			tag = semver.valid(tag);
			if (tag && (!highestTag || semver.gt(tag, highestTag))) {
				highestTag = tag;
			}
		});

		return highestTag;
	},
	isClean: function () {
		return exec('git diff-index --quiet HEAD --').code === 0;
	},
	isTagged: function () {
		return !!exec('git tag --points-at HEAD').output.split('\n').filter(function (line) { return !!line; }).length;
	}
};

module.exports = function(grunt) {
	// Error handler
	function failed(message, error) {
		grunt.fail.warn(message || 'Task failed.');
		if (error) {
			grunt.verbose.error(error);
		}
	}

	// Task definition
	grunt.registerMultiTask('checkrepo', 'Checking repository state.', function () {
		var config = this.data;
		var queue = Object.keys(config);

		// Check for checks
		if (!queue.length) {
			failed('No checks requested.');
			return;
		}

		// Check for git repository
		if (exec('git status').code !== 0) {
			failed('Git repository not found.');
			return;
		}

		/**
		 * Repository checks.
		 *
		 * @type {Object}
		 */
		var checks = {
			tag: function (config) {
				var highestTag = git.getHighestTag();
				var methods = Object.keys(config);
				var result = true;

				methods.forEach(function (method) {
					if (method === 'valid') {
						if (semver.valid(config.valid)) {
							grunt.verbose.ok('Version "' + String(config.valid).cyan + '" is a valid semantic version.');
						} else {
							failed('Version "' + config.valid + '" is not a valid semantic version.');
							result = false;
						}
					} else {
						if (semver[method](highestTag, config[method])) {
							grunt.verbose.ok('Highest tag "' + String(highestTag).cyan + '" is ' + method + ' "' + String(config[method]).cyan+ '".');
						} else {
							failed('Highest tag "' + highestTag + '" is not ' + method + ' "' + config[method] + '".');
							result = false;
						}
					}
				});

				return result;
			},
			tagged: function (flag) {
				if (git.isTagged() === flag) {
					grunt.verbose.ok('Current commit is' + (flag ? '' : ' not') + ' tagged.');
					return true;
				} else {
					failed('Current commit is' + (flag ? ' not' : '') + ' tagged.');
					return false;
				}
			},
			clean: function (flag) {
				if (git.isClean() === flag) {
					grunt.verbose.ok('There are' + (flag ? ' no' : '') + ' unstaged changes.');
					return true;
				} else {
					failed('There are' + (flag ? '' : ' no') + ' unstaged changes.');
					return false;
				}
			}
		};

		// Run checks
		for (var i = 0; i < queue.length; i++) {
			if (!checks[queue[i]](config[queue[i]])) {
				break;
			}
		}
	});
};