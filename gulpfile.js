import gulp from 'gulp'; // gulp
import browserSync from 'browser-sync'; 
import notify from 'gulp-notify'; // выводит сообщения об ошибках
import plumber from 'gulp-plumber'; // обрабатывает ошибки
import del from 'del'; // позволяет удалять файлы и папки
import autoprefixer from 'gulp-autoprefixer'; // добавляет префиксы
import fileinclude from 'gulp-file-include'; // для подключения файлов html друг в друга
import gulpHtmlmin from 'gulp-htmlmin'; // минимизирует файлы
import sourcemaps from 'gulp-sourcemaps'; // добавляет sourcemaps карту
import gulpIf from 'gulp-if'; // запускает команды по условию

import sass from 'sass'; // работает с sass файлами
import gulpSass from 'gulp-sass'; // принимает sass или scss файлы и передаёт в sass для последующей обработки.
import sassGlob from 'gulp-sass-glob'; // автоматическое подключение sсss файлов
import gcmq from 'gulp-group-css-media-queries'; // груперует медиа запросы
import concat from 'gulp-concat'; // объяденяет файлы
import htmlmin from 'gulp-htmlmin';

// JS
import webpack from 'webpack-stream';




// import watch from 'gulp-watch';
// import imagemin from 'gulp-imagemin'; // Сжимает фотки
// import newer from 'gulp-newer'; // проверяет если фотки сжаты, то повторно не сжимает
// import babel from 'gulp-babel'; // переводит js файлы в старый формат
// import gulpRename from 'gulp-rename'; // переименовывает файлы


// const gulp = () => {
// 	console.log('export');
// }; 
let dev = false;


const path = {
  src: {
    base: 'src/',
    html: 'src/html/*.html',
    scss: 'src/scss/main.scss',
    js: 'src/js/**/*.js',
    img: 'src/images/**/*.{jpg,svg,jpeg,png,gif,webp,ico}',
    assets: ['src/fonts/**/*.*','src/libs/**/*.*','src/video/**/*.*'],
    libs: 'src/libs/**/*.*',
    fonts: 'src/fonts/**/*.*',
    video: 'src/video/**/*.*',
    doc: 'src/doc/**/*.*',
  },
  dist: {
    base: 'dist/',
    libs: 'dist/libs/',
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    img: 'dist/images/',
    fonts: 'dist/fonts/',
    video: 'dist/video/',
    doc: 'dist/doc/',
  },
  watch: {
    html: 'src/html/**/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/images/**/*.{jpg,svg,jpeg,png,gif,webp,ico}',
  },
};

export const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(
      plumber({ // обрабатываем ошибки
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
    .pipe(gulpIf(!dev, htmlmin({ // проверяем с помощью gulpIf если первый аргумент будет true то вызываем таск во втором аргументе. 
      removeComments: true, // убираем комментарии
      collapseWhitespace: true, // убираем пробелы
    })))
    .pipe(gulp.dest(path.dist.html)) // копируем обработанные файлы в папку сборки
    .pipe(browserSync.stream())
};

const scssToCss = gulpSass(sass);

export const scss = () => {
  return gulp
  .src(path.src.scss)
  .pipe(sassGlob({ // подключаем scss файлы по маске
      ignorePaths: [
        '**/**/_old_*.scss', // не отслеживаем файлы которые попадают под маску
        // '**/blocks/_old_*.scss',
        // 'recursive/*.scss',
          // 'import/**'
      ]
    })
  )
  .pipe(
    plumber({
      errorHandler: notify.onError(function (err) {
        return {
            title: "SCSS include",
            sound: false,
            message: err.message
        };
      })
    })
  )
  .pipe(gulpIf(dev, sourcemaps.init())) // инициализируем карту scss
  .pipe(scssToCss()) // обрабатываем scss и в случае ошибки выводим в консоль
  // .pipe(scssToCss().on('error', scssToCss.logError)) // обрабатываем scss и в случае ошибки выводим в консоль
  .pipe(gulpIf(!dev, autoprefixer({ // обрабатываем автопрефиксером
    overrideBrowserslist: ["last 1 versions"]
  })))
  .pipe(gulpIf(!dev, gcmq()))// объединяем медиа запросы
  .pipe(gulpIf(dev, sourcemaps.write(".")))
  .pipe(gulp.dest(path.dist.css))
  .pipe(browserSync.stream())
};

const configWebpack = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-sourse-map' : false,
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'all.js'
  },
  module: {
    rules: []
  }
};

if (!dev) {
  configWebpack.module.rules.push({
    test: /\.(js)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }
  })
}

export const js = () => {
  return gulp
  .src(path.src.js)
  .pipe(plumber())
  .pipe(webpack(configWebpack))
  // .pipe(concat('all.js'))
  .pipe(gulp.dest(path.dist.js))
  .pipe(browserSync.stream())
};

export const images = () => {
  return gulp
  .src(path.src.img)
  .pipe(gulp.dest(path.dist.img))
  .pipe(browserSync.stream({
    once: true,
  }))
};

export const libs = () => {
  return gulp
  .src(path.src.libs)
  .pipe(gulp.dest(path.dist.libs))
  .pipe(browserSync.stream({
    once: true,
  }))
};

export const fonts = () => {
  return gulp
  .src(path.src.fonts)
  .pipe(gulp.dest(path.dist.fonts))
  .pipe(browserSync.stream({
    once: true,
  }))
};

export const video = () => {
  return gulp
  .src(path.src.video)
  .pipe(gulp.dest(path.dist.video))
  .pipe(browserSync.stream({
    once: true,
  }))
};

export const doc = () => {
  return gulp
  .src(path.src.doc)
  .pipe(gulp.dest(path.dist.doc))
  .pipe(browserSync.stream({
    once: true,
  }))
};

// export const copy = () => {
//   return gulp
//   // .src(path.src.assets)
//   .src(path.src.assets, {
//     base: 'dist/',
//   })
//   // .pipe(plumber())
//   .pipe(gulp.dest(path.dist.base))
//   .pipe(browserSync.stream({
//     once: true,
//   }))
// };

export const server = () => {
  browserSync.init({
    // host: 'localhost', // переопределяет хост
    // notify: false, // показывает всплывающие увидомления в браузере
    // tunnel: true, // публикует сайт на времменном сервере в интернете 
    server: {
      baseDir: path.dist.base
    }
  });
  gulp.watch(path.watch.html, html) // следим за файлами html и при изменении запускаем таск html
  gulp.watch(path.watch.scss, scss) // следим за файлами scss и при изменении запускаем таск scss
  gulp.watch(path.watch.js, js) // следим за файлами js и при изменении запускаем таск js
  gulp.watch(path.watch.img, images) // следим за файлами images и при изменении запускаем таск images
  gulp.watch(path.src.libs, libs) // следим за файлами images и при изменении запускаем таск images
  gulp.watch(path.src.fonts, fonts) // следим за файлами images и при изменении запускаем таск images
  gulp.watch(path.src.doc, doc) // следим за файлами images и при изменении запускаем таск images
  gulp.watch(path.src.video, video) // следим за файлами images и при изменении запускаем таск images
};

const clear = () => del(path.dist.base, {force: true}); // очищаем папку dist

const develop = (ready) => { // функция вызывающая сборку для разработки
  dev = true;
  ready();
}

const base = gulp.parallel(html, scss, js, images, libs, video, doc, fonts) // запускаем паралельные таски

const build = gulp.series(clear, base); // Собирает сборку на продакшн

export default gulp.series(develop, clear, base, server);



















// const gulp = require("gulp"); // Подключаем Gulp
// const browserSync = require("browser-sync").create();
// const watch = require("gulp-watch");
// const sass = require("gulp-sass"); 
// const autoprefixer = require("gulp-autoprefixer"); // добавляет автопрефиксы
// const sourcemaps = require("gulp-sourcemaps"); // добавляет sourcemaps карту
// const notify = require("gulp-notify"); // выводит сообщения об ошибках
// const plumber = require("gulp-plumber"); // обрабатывает ошибки
// const gcmq = require("gulp-group-css-media-queries"); // груперует медиа запросы
// const sassGlob = require("gulp-sass-glob"); // автоматическое подключение sсss файлов
// const fileinclude = require("gulp-file-include"); // для подключения файлов html друг в друга
// const del = require("del"); // позволяет удалять файлы и папки
// const imagemin = require("gulp-imagemin"); // Сжимает фотки
// const newer = require("gulp-newer"); // проверяет если фотки сжаты, то повторно не сжимает 
// const babel = require('gulp-babel'); // переводит js файлы в старый формат
// const concat = require('gulp-concat'); // объяденяет файлы

// // Таск для сборки html из шаблонов
// gulp.task('html', function(callback) {
// 	return gulp.src('./src/html/*.html')
// 		.pipe(
// 				plumber({
// 					errorHandler: notify.onError(function (err) {
// 						return {
// 								title: "HTML include",
// 								sound: false,
// 								message: err.message
// 						};
// 					})
// 				})
// 		)
// 		.pipe(fileinclude({ prefix: '@@'}))
// 		.pipe(gulp.dest('./build'))
// 		.pipe(browserSync.stream());

// 	callback();
// });
// // gulp.task('php', function(callback) {
// //     return gulp.src('./src/html/*.php')
// //         .pipe(
// //             plumber({
// //                 errorHandler: notify.onError(function (err) {
// //                     return {
// //                         title: "HTML include",
// //                         sound: false,
// //                         message: err.message
// //                     };
// //                 })
// //             })
// //         )
// //         .pipe(fileinclude({ prefix: '@@'}))
// //         .pipe(gulp.dest('./build'))
// //         .pipe(browserSync.stream());

// //     callback();
// // });


// // Таск для компиляции SCSS в CSS
// gulp.task("scss", function(callback) {
// 	return gulp
// 		.src("./src/scss/main.scss")
// 		.pipe(
// 				plumber({
// 					errorHandler: notify.onError(function(err) {
// 						return {
// 								title: "Styles",
// 								sound: false,
// 								message: err.message
// 						};
// 					})
// 				})
// 		)
// 		.pipe(sourcemaps.init())
// 		.pipe(sassGlob({
// 				ignorePaths: [
// 					'**/**/_old_*.scss',
// 					// '**/blocks/_old_*.scss',
// 					// 'recursive/*.scss',
// 						// 'import/**'
// 				]
// 			}))
// 		.pipe(
// 				sass({
// 					indentType: "tab",
// 					indentWidth: 1,
// 					outputStyle: "expanded",
// 					sourceComments: true,
// 					sourceMapContents: true
// 					// outputStyle: "compressed"
// 				})
// 		)
// 		.pipe(gcmq())
// 		.pipe(
// 				autoprefixer({
// 					overrideBrowserslist: ["last 1 versions"]
// 				})
// 		)
// 		.pipe(sourcemaps.write("."))
// 		.pipe(gulp.dest("./build/css/"))
// 		.pipe(browserSync.stream());
// 	callback();
// });
// // Копирование скриптов
// function js (callback) {
// 	gulp.src('./src/js/**/*.js')
// 		.pipe(sourcemaps.init())
// 		.pipe(babel({
// 				presets: ['@babel/env']
// 		}))
// 		.pipe(concat('all.js'))
// 		.pipe(sourcemaps.write('.'))
// 		.pipe(gulp.dest('./build/js/'))

// 	callback();
// }
// // Сжатие изображений и копирование в папку build
// // function img (callback) {
// //     return gulp.src('./src/images/**/*.*')
// //     .pipe(newer('./build/images/')) // проверяем сжималось ли изображение ранее, если да, то больше не сжимаем
// //     .pipe(imagemin()) // сжимаем изображение
// //     .pipe(gulp.dest('./build/images/')) // копируем в папку готового проекта

// //     callback();
// // }



// gulp.task('img', function(callback){
// 	return gulp.src('./src/images/**/*.*')
// 		.pipe(newer('./build/images/')) // проверяем сжималось ли изображение ранее, если да, то больше не сжимаем
// 		.pipe(imagemin([
// 				imagemin.gifsicle({interlaced: true}),
// 				// imagemin.mozjpeg({quality: 95, progressive: true}),
// 				// imagemin.optipng({optimizationLevel: 5}),
// 		])) // сжимаем изображение
// 		.pipe(gulp.dest('./build/images/')) // копируем в папку готового проекта
    
// 	callback();
// }); 





// // gulp.task('copy:img', function(callback){
// //     return gulp.src('./src/images/**/*.*')
// //         .pipe(gulp.dest('./build/images/'))
    
// //     callback();
// // }); 


// // gulp.task('copy:js', function(callback){
// //     return gulp.src('./src/js/**/*.*')
// //         .pipe(gulp.dest('./build/js/'))

// //     callback();
// // }); 

// // Копирование библиотек
// gulp.task('copy:libs', function(callback){
// 	return gulp.src('./src/libs/**/*.*')
// 	.pipe(gulp.dest('./build/libs/'))

// 	callback();
// }); 

// // Копирование библиотек
// gulp.task('copy:video', function(callback){
// 	return gulp.src('./src/video/**/*.*')
// 	.pipe(gulp.dest('./build/video/'))

// 	callback();
// }); 

// // Копирование Шрифтов
// gulp.task('copy:fonts', function(callback){
// 	return gulp.src('./src/fonts/**/*.*')
// 	.pipe(gulp.dest('./build/fonts/'))

// 	callback();
// }); 
// // exports.img = img; // экспортируем img в таск
// exports.js = js; // экспортируем js в таск


// // Слежение за HTML и CSS и обновление браузера
// gulp.task("watch", function() {
// 	// Слежение за HTML и CSS и обновление браузера
// 	watch(
// 		// ["./build/*.html", "./build/css/**/*.css"],
// 		// Следим за картинками, скриптами, шрифтами и libs и перезагружаем браузер
// 		["./build/js/**/*.*",
// 				// "./build/images/**/*.*",
// 				"./build/fonts/**/*.*",
// 				"./build/libs/**/*.*"    
// 		],
// 		gulp.parallel(browserSync.reload)
// 	);

// 	// Слежение за SCSS и компиляция в CSS - обычный способ
// 	// watch('./app/scss/**/*.scss', gulp.parallel('scss'));

// 	// Запуск слежения и компиляции SCSS с задержкой, для жесктих дисков HDD
// 	watch("./src/scss/**/*.scss", function() {
// 		setTimeout(gulp.parallel("scss"), 1000);
// 	});

// 	// Слежение за html и сборка страниц из шаблонов
// 	watch("./src/html/**/*.html", gulp.parallel("html"));

// 	// Слежение за php и сборка страниц из шаблонов
// 	// watch("./src/html/**/*.php", gulp.parallel("php"));

// 	// Слежение за картинками и скриптами и копирование в build
// 	watch("./src/js/**/*.*", gulp.parallel(js));
// 	watch('./src/images/**/*.*', gulp.parallel('img'));
// 	// watch("./src/images/**/*.*", gulp.parallel("copy:img"))
// 	// watch("./src/js/**/*.*", gulp.parallel("copy:js"));
// 	watch("./src/libs/**/*.*", gulp.parallel("copy:libs"));
// 	watch("./src/fonts/**/*.*", gulp.parallel("copy:fonts"));


// });

// // Задача для старта сервера из папки app
// gulp.task("server", function() {
// 	browserSync.init({
// 		server: {
// 				baseDir: "./build/"
// 		}
// 	});
// });

// // Таск удаления файлов
// gulp.task('clean:build', function(callback){
// 	return del('./build')

// 	callback();
// }); 




// // Дефолтный таск (задача по умолчанию)
// // Запускаем одновременно задачи server и watch
// // gulp.task("default", gulp.parallel("server", "watch", "scss", "html"));
// gulp.task(
// 	"default",
// 	gulp.series('clean:build',
// 		// gulp.parallel('clean:build'),
// 		// gulp.parallel('scss', 'html', 'copy:img','copy:js', 'copy:libs', 'copy:fonts'),
// 		gulp.parallel('scss', 'html', js, 'img', 'copy:libs', 'copy:video', 'copy:fonts'),
// 		gulp.parallel("server", "watch")
// 		)
// );
