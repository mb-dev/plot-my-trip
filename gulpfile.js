var child 				= require('child_process')
var gulp          = require("gulp")
var gutil				  = require('gulp-util')
var shell 			  = require("gulp-shell")
var webpack 		  = require("webpack")
var webpackConfig = require("./webpack.config.js");

gulp.task("test", shell.task(['go test ./...']));

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
	gulp.watch(["client/**/*"], ["webpack"]);
	gulp.watch(["api/**/*.go", "server.go"], ["server"])
});

gulp.task("webpack", function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});
