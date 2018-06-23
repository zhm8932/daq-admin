'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const compass = require('gulp-compass');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const server = require('gulp-develop-server');


var PATHSdir = {
    sass:'./client/sass/**/*.scss',
    js:'./client/js/**/*.js'
};


gulp.task('js', function() {
    gulp.src([PATHSdir.js])
        .on('error', function() {
            console.log('编译出错');
        })
        .pipe(gulp.dest('./public/js'))

});
//js压缩
gulp.task('jsmin', function() {

    gulp.src([PATHSdir.js])
        .pipe(uglify({
            compress: true,
            mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
        }))
        .on('error', function() {
            console.log('编译出错');
        })
        .pipe(gulp.dest('./public/js'))

});

//编译sass
// gulp.task('compile:sass', function() {
//   gulp.src('./src/sass/**/*.scss')
//     .pipe(compass({
//       config_file: './config.rb',
//       css: './public/css-new',
//       sass: './src/sass'
//     }))
//     .pipe(gulp.dest('./public/css-new'));
// });
gulp.task('sass', function () {
    sass(PATHSdir.sass)
        .on('err', sass.logError)
        .pipe(gulp.dest('public/css'))
    // .pipe(cleanCSS())
    // .pipe(rename({
    //     suffix: '.min'
    // }))
    // .pipe(gulp.dest('public/css'));
});
gulp.task('mincss', function () {
    sass(PATHSdir.sass)
        .on('err', sass.logError)
        .pipe(uglify())
        .pipe(gulp.dest('public/css'))
    // .pipe(cleanCSS())
    // .pipe(rename({
    //     suffix: '.min'
    // }))
    // .pipe(gulp.dest('public/css'));
});
// gulp.task('compile:sass', function() {
//     gulp.src('./client/sass/**/*.scss')
//         .pipe(compass({
//             config_file: './config.rb',
//             css: './public/css',
//             sass: './client/sass'
//         }))
//         .pipe(gulp.dest('./public/css'));
// });
//
// //压缩css
// gulp.task('mincss', function() {
//     gulp.src(PATHSdir.sass)
//         .pipe(compass({
//             config_file: './config.rb',
//             css: './public/css',
//             sass: './client/sass'
//         }))
//         .pipe(uglifycss())
//         .pipe(gulp.dest('./public/css'));
// });

//压缩css
gulp.task('uglify:css', function () {
  gulp.src('./public/css/**/*.css')
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(gulp.dest('./public/css-new/'));
});

// 运行 server
gulp.task('server:start', function() {
    server.listen({
        path: './bin/www',
        env: {
            // PORT: 3001,
            NODE_ENV: 'development',
            DEBUG: 'medical_daq:server'
        }
    });
});

//重新启动
gulp.task('watch', function() {
    gulp.watch([PATHSdir.sass], ['sass']);
    gulp.watch([PATHSdir.js], ['js']);
    // gulp.watch(['./bin/www', './app.js', './routers/**/*.js', './request/**/*.js', './lib/**/*.js', './config/**/*.js', './controllers/**/*.js'], server.restart);
});

gulp.task('default', ['sass','js','watch']);
// gulp.task('sass', ['compile:sass','js','watch']);
gulp.task('prod', ['mincss','jsmin']);
// gulp.task('prod', ['uglify:css','compile:sass']);
// gulp.task('default', ['uglify:js', 'compile:sass','server:start', 'watch']);