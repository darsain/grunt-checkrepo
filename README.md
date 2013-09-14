# grunt-checkrepo

Check the state of repository.

Task will cancel grunt tasks queue when repository state doesn't comply with your requirements. You can look at it as
a simple repository linting.

This is a [Grunt](http://gruntjs.com/) 0.4 plugin. If you haven't used [Grunt](http://gruntjs.com/) before, be sure to
check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a
[Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

## Installation

Use npm to install and save the plugin into `devDependencies`.

```shell
npm install grunt-checkrepo --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-checkrepo');
```

## Configuration

In your project's Gruntfile, add a section named `checkrepo` to the data object passed into `grunt.initConfig()`. This
is a multitask task and accepts multiple targets.

```js
grunt.initConfig({
	checkrepo: {
		foo: {
			// Foo target options
		},
		bar: {
			// Bar target options
		},
	},
});
```

There are no default options. Each target property is a check that will be run, and its value is a required state.

## Available checks

#### tag
Type: `Object`

Will run [`semver`](https://github.com/isaacs/node-semver) functions & comparisons against passed version and highest
repo tag. Each object property name is a `semver` method, and property value is one argument being passed to it.

Example:

```js
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	checkrepo: {
		foo: {
			tag: {
				valid: '<%= pkg.version %>', // Check if pkg.version is valid semantic version
				lt: '<%= pkg.version %>',    // Check if highest repo tag is lower than pkg.version
			},
		}
	},
});
```

Available methods:

`valid`, `gt`, `gte`, `lt`, `lte`, `eq`, `neq`

#### tagged
Type: `Boolean`

Checks whether the last commit (HEAD) is or is not already tagged.

Example:

```js
checkrepo: {
	foo: {
		tagged: true, // Require last commit (HEAD) to be tagged
	},
	bar: {
		tagged: false, // Require last commit (head) to not be tagged
	}
}
```

#### clean
Type: `Boolean`

Check whether the repository is clean - has no unstaged changes.

Example:

```js
checkrepo: {
	foo: {
		clean: true, // Require repo to be clean (no unstaged changes)
	},
	bar: {
		clean: false, // Require repo to be dirty (have unstaged changes)
	}
}
```

## Usage Example

Task with all available options:

```js
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	checkrepo: {
		foo: {
			tag: {
				valid: '<%= pkg.version %>', // Check if pkg.version is valid semantic version
				gt: '<%= pkg.version %>',    // Check if highest repo tag is greater than pkg.version
				gte: '<%= pkg.version %>',   // Check if highest repo tag is greater or equal to pkg.version
				lt: '<%= pkg.version %>',    // Check if highest repo tag is lower than pkg.version
				lte: '<%= pkg.version %>',   // Check if highest repo tag is lower or equal than pkg.version
				eq: '<%= pkg.version %>',    // Check if highest repo tag is equal to pkg.version
				neq: '<%= pkg.version %>',   // Check if highest repo tag is not equal to pkg.version
			},
			tagged: false, // Check if last repo commit (HEAD) is not tagged
			clean: true,   // Check if the repo working directory is clean
		}
	},
});
```