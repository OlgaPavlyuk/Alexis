const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const jade = require('gulp-jade');
const plumber = require('gulp-plumber');
 
let config = {
	src: './src/',
	css: {
		src: 'style/precss/',
		dest: 'style/css'
	}
};

gulp.task('serve', ['sass', 'copy-html'], function() {
    
    browserSync.init({
        server: {
            baseDir: config.src
        },

        "ghostMode": false

    });


    gulp.watch(config.src + config.css.src + "*.scss", ['sass']);
	gulp.watch(config.src + 'template/*.jade',['jade', 'copy-html', browserSync.reload]);
    gulp.watch(config.src + "*.html").on('change', browserSync.reload);
    gulp.watch(config.src + "js/*.js").on('change', browserSync.reload);
});


gulp.task('sass', function() {
    return gulp.src(config.src + config.css.src + "*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.src + config.css.dest))
        .pipe(browserSync.stream());
});

gulp.task('jade', function() {
  
  gulp.src('./src/template/*.jade')
	.pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('./src/template'))
});

gulp.task('copy-html', function() {
   gulp.src(['./src/template/index.html'])
        .pipe(gulp.dest('./src'));
});

gulp.task('imageMinimaze', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('src/images'))
);


gulp.task('default', ['serve']);


