var gulp   = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var FileWatchArray = [
    './Helpers/Web_start.js',
    './App/index.js',
    './Helpers/Web.js',
    './Helpers/index.js',
    './App/subscribeObject.js',
    './App/WSObject.js',
    './App/PublicWS.js',
    './App/PrivateWS.js'
];

gulp.task('default', function() {
    return gulp.src(FileWatchArray).pipe(concat('exmoWS.js')).pipe(gulp.dest('./')).pipe(concat('exmoWS.min.js')).pipe(uglify()).pipe(gulp.dest('./'));
});

gulp.watch(FileWatchArray, gulp.parallel(['default']));