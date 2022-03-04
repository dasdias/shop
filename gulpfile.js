const gulp = require("gulp"); // Подключаем Gulp
const browserSync = require("browser-sync").create();
const watch = require("gulp-watch");
const sass = require("gulp-sass"); 
const autoprefixer = require("gulp-autoprefixer"); // добавляет автопрефиксы
const sourcemaps = require("gulp-sourcemaps"); // добавляет sourcemaps карту
const notify = require("gulp-notify"); // выводит сообщения об ошибках
const plumber = require("gulp-plumber"); // обрабатывает ошибки
const gcmq = require("gulp-group-css-media-queries"); // груперует медиа запросы
const sassGlob = require("gulp-sass-glob"); // автоматическое подключение sсss файлов
const fileinclude = require("gulp-file-include"); // для подключения файлов html друг в друга
const del = require("del"); // позволяет удалять файлы и папки
const imagemin = require("gulp-imagemin"); // Сжимает фотки
const newer = require("gulp-newer"); // проверяет если фотки сжаты, то повторно не сжимает 
const babel = require('gulp-babel'); // переводит js файлы в старый формат
const concat = require('gulp-concat'); // объяденяет файлы

// Таск для сборки html из шаблонов
gulp.task('html', function(callback) {
    return gulp.src('./src/html/*.html')
        .pipe(
            plumber({
                errorHandler: notify.onError(function (err) {
                    return {
                        title: "HTML include",
                        sound: false,
                        message: err.message
                    };
                })
            })
        )
        .pipe(fileinclude({ prefix: '@@'}))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());

    callback();
});


// Таск для компиляции SCSS в CSS
gulp.task("scss", function(callback) {
    return gulp
        .src("./src/scss/main.scss")
        .pipe(
            plumber({
                errorHandler: notify.onError(function(err) {
                    return {
                        title: "Styles",
                        sound: false,
                        message: err.message
                    };
                })
            })
        )
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(
            sass({
                indentType: "tab",
                indentWidth: 1,
                outputStyle: "expanded"
            })
        )
        .pipe(gcmq())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 1 versions"]
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./build/css/"))
        .pipe(browserSync.stream());
    callback();
});
// Копирование скриптов
function js (callback) {
    gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js/'))

    callback();
}
// Сжатие изображений и копирование в папку build
// function img (callback) {
//     return gulp.src('./src/images/**/*.*')
//     .pipe(newer('./build/images/')) // проверяем сжималось ли изображение ранее, если да, то больше не сжимаем
//     .pipe(imagemin()) // сжимаем изображение
//     .pipe(gulp.dest('./build/images/')) // копируем в папку готового проекта

//     callback();
// }



gulp.task('img', function(callback){
    return gulp.src('./src/images/**/*.*')
        .pipe(newer('./build/images/')) // проверяем сжималось ли изображение ранее, если да, то больше не сжимаем
        .pipe(imagemin()) // сжимаем изображение
        .pipe(gulp.dest('./build/images/')) // копируем в папку готового проекта
        
    callback();
}); 





// gulp.task('copy:img', function(callback){
//     return gulp.src('./src/images/**/*.*')
//         .pipe(gulp.dest('./build/images/'))
        
//     callback();
// }); 


// gulp.task('copy:js', function(callback){
//     return gulp.src('./src/js/**/*.*')
//         .pipe(gulp.dest('./build/js/'))

//     callback();
// }); 

// Копирование библиотек
gulp.task('copy:libs', function(callback){
    return gulp.src('./src/libs/**/*.*')
    .pipe(gulp.dest('./build/libs/'))
    
    callback();
}); 

// Копирование Шрифтов
gulp.task('copy:fonts', function(callback){
    return gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('./build/fonts/'))
    
    callback();
}); 
// exports.img = img; // экспортируем img в таск
exports.js = js; // экспортируем js в таск


// Слежение за HTML и CSS и обновление браузера
gulp.task("watch", function() {
    // Слежение за HTML и CSS и обновление браузера
    watch(
        // ["./build/*.html", "./build/css/**/*.css"],
        // Следим за картинками, скриптами, шрифтами и libs и перезагружаем браузер
        ["./build/js/**/*.*",
            // "./build/images/**/*.*",
            "./build/fonts/**/*.*",
            "./build/libs/**/*.*"    
        ],
        gulp.parallel(browserSync.reload)
    );
    
    // Слежение за SCSS и компиляция в CSS - обычный способ
    // watch('./app/scss/**/*.scss', gulp.parallel('scss'));
    
    // Запуск слежения и компиляции SCSS с задержкой, для жесктих дисков HDD
    watch("./src/scss/**/*.scss", function() {
        setTimeout(gulp.parallel("scss"), 1000);
    });
    
    // Слежение за html и сборка страниц из шаблонов
    watch("./src/html/**/*.html", gulp.parallel("html"));
    
    // Слежение за картинками и скриптами и копирование в build
    watch("./src/js/**/*.*", gulp.parallel(js));
    watch('./src/images/**/*.*', gulp.parallel('img'));
    // watch("./src/images/**/*.*", gulp.parallel("copy:img"))
    // watch("./src/js/**/*.*", gulp.parallel("copy:js"));
    watch("./src/libs/**/*.*", gulp.parallel("copy:libs"));
    watch("./src/fonts/**/*.*", gulp.parallel("copy:fonts"));

    
});

// Задача для старта сервера из папки app
gulp.task("server", function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

// Таск удаления файлов
gulp.task('clean:build', function(callback){
    return del('./build')

    callback();
}); 




// Дефолтный таск (задача по умолчанию)
// Запускаем одновременно задачи server и watch
// gulp.task("default", gulp.parallel("server", "watch", "scss", "html"));
gulp.task(
    "default",
    gulp.series('clean:build',
        // gulp.parallel('clean:build'),
        // gulp.parallel('scss', 'html', 'copy:img','copy:js', 'copy:libs', 'copy:fonts'),
        gulp.parallel('scss', 'html', js, 'img', 'copy:libs', 'copy:fonts'),
        gulp.parallel("server", "watch")
        )
);
