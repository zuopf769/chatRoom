var gulp = require('gulp');
var devServer = require('gulp-develop-server');

// run server
gulp.task('server:start', function() {
    devServer.listen({
        path: './app.js'
    });
});

// restart server if index.js changed
gulp.task('server:restart', function() {
     devServer.restart();
});

// watch file change then restart server
gulp.task('watch', function() {
    gulp.watch(['./**/*', '!./gulpfile.js', '!./package.json', '!./public/**/*'], ['server:restart']);
});

// default task
gulp.task('default', ['server:start', 'watch']);