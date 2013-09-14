'use strict';

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js',
			],
		},
		checkrepo: {
			foo: {
				tag: {
					valid: '<%= pkg.version %>',
					lt: '<%= pkg.version %>',
					gt: '0.0.0'
				},
				tagged: false,
				clean: false,
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Registering the testing task.
	grunt.registerTask('test', ['checkrepo:foo']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);
};