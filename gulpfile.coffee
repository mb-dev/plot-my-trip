# include gulp
gulp         = require("gulp")

# include our plugins
sass         = require("gulp-sass")
plumber      = require("gulp-plumber")
notify       = require("gulp-notify")
minifycss    = require("gulp-minify-css")
autoprefixer = require("gulp-autoprefixer")
concat       = require("gulp-concat")
rename       = require("gulp-rename")
uglify       = require("gulp-uglify")
coffee       = require("gulp-coffee")
jade         = require("gulp-jade")
clean        = require("gulp-clean")
connect      = require("gulp-connect")
lr           = require("tiny-lr")
livereload   = require("gulp-livereload")
server       = lr()

# paths
src          = "client"
dist         = "static"

# jade
gulp.task "jade", ->
	gulp.src src + "/**/*.jade"
	.pipe plumber()
	.pipe jade
		pretty: true
	.on "error", notify.onError()
	.on "error", (err) ->
		console.log "Error:", err
	.pipe gulp.dest dist + '/'
	.pipe livereload(server)

# scripts
gulp.task "scripts", ->
	gulp.src src + "/**/*.coffee"
	.pipe coffee
		bare: true
	.pipe concat("scripts.js")
	.pipe gulp.dest dist + "/"
	.pipe connect.reload()
