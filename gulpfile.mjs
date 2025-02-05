import browserSync from 'browser-sync'
import gulp from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import cleanCSS from 'gulp-clean-css'
import uglify from 'gulp-uglify-es'
import * as sass from 'sass'

//Compile SCSS into CSS
function style() {
    return gulp
        .src([
            '!./assets/preprocess/sass/**/home.scss',
            './assets/preprocess/sass/**/*.scss',
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({grid: 'autoplace'}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream())
}

function script() {
    return gulp
        .src('./assets/preprocess/scripts/**/*.js')
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js'))
        .pipe(browserSync.stream())
}

function watch() {
    browserSync.init({
        proxy: 'http://localhost/edwinbroce/',
        browser: 'chrome.exe',
        files: [
            {
                match: ['./assets/css/**/*.css'],
                fn: function (event, file) {
                    this.reload()
                },
            },
        ],
        watchEvents: ['change', 'add', 'unlink', 'addDir', 'unlinkDir'],
    })
    gulp.watch('./assets/preprocess/**/*.scss', style)
    gulp.watch('./assets/**/_variables.scss', style)
    gulp.watch('./assets/**/_fonts.scss', style)
    gulp.watch('./assets/preprocess/scripts/**/*.js', script)
    gulp.watch('./**/*.php').on('change', browserSync.reload)
    gulp.watch('./**/*.html').on('change', browserSync.reload)
}

gulp.task(style)
gulp.task(watch)
