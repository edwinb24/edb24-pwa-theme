let gulp = require('gulp')
const babel = require('gulp-babel')
let uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')(require('sass'))
let cleanCSS = require('gulp-clean-css')

gulp.task('script', function () {
    return gulp
        .src('./assets/preprocess/scripts/**/*.js')
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js'))
})

gulp.task('sass', function () {
    return gulp
        .src([
            '!./assets/preprocess/sass/**/home.scss',
            './assets/preprocess/sass/**/*.scss',
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./assets/css'))
})
