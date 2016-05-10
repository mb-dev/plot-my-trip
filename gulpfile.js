const DEBUG = process.env.NODE_ENV === 'debug';
const CI = process.env.CI === 'true';

var child 				   = require('child_process');
var gulp             = require("gulp");
var gutil				     = require('gulp-util');
var shell 			     = require("gulp-shell");
var webpack 		     = require("webpack");
var mocha					   = require('gulp-spawn-mocha');
var webpackConfig    = require("./webpack.config.js");
var notify				   = require('gulp-notify');
var WebpackDevServer = require("webpack-dev-server");
var runSequence      = require('run-sequence');
var bg = require("gulp-bg");

process.on('uncaughtException', function (er) {
  console.error('Throwing error:', er);
});

gulp.task("mocha", function() {
	return gulp.src(['client/**/*.test.js'], {read: false})
		.pipe(mocha({
			compilers: 'js:babel-core/register',
    }));
});

gulp.task("gotest", shell.task(['go test ./...']));

gulp.task("test", ['gotest', 'mocha']);

server = null;
gulp.task("server", function(done) {
	spawn = function() {
		server = child.spawn('go', ['run', 'server.go']);
		server.stdout.on('data', function(data) {
			var lines = data.toString().split('\n')
			for (var l in lines)
				if (lines[l].length)
					gutil.log(lines[l]);
		});
		server.stderr.on('data', function(data) {
			process.stdout.write(data.toString());
		});
		server.on('close', function() {
			server = null;
		});
	}
	if (server) {
		server.on('close', function() {
			process.stdout.write("server closed...\n");
			spawn();
			done();
		});
		server.kill();
		child.exec('killall server');
	} else {
		spawn();
		done();
	}
});

gulp.task("dev", ["server", "webpack"], function() {
	gulp.watch(["api/**/*.go", "server.go"], ["server"]);
});

gulp.task("webpack", function() {
		if (CI) {
			webpackConfig.watch = false;
			webpackConfig.bail = true;
		}
    // run webpack
    webpack(webpackConfig, function(err, stats) {
      if (err) {
				throw new gutil.PluginError("webpack", err);
			}
      gutil.log("[webpack]", stats.toString({
          // output options
      }));
    });
});

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
				notify('compile finished');
    });

    new WebpackDevServer(compiler, webpackConfig.devServer).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        callback();
    });
});
