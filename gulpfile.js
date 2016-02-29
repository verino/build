var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	notify = require('gulp-notify'),
	spritesmith = require('gulp.spritesmith'),
	uncss = require('gulp-uncss'),
	csscomb = require('gulp-csscomb'),
	connect = require('gulp-connect'),
	rigger = require('gulp-rigger'),
	livereload = require('gulp-livereload');

gulp.task('connect', function() {
  connect.server({
    root: 'dist/',
    livereload: true
  });
});

gulp.task('html', function(){
	return gulp.src('src/*.html')
	.pipe(rigger())
	.pipe(gulp.dest('dist/'))
	.pipe(connect.reload());
});

gulp.task('font', function(){
	return gulp.src('src/font/*')
	.pipe(gulp.dest('dist/font/'))
	.pipe(connect.reload());
});

gulp.task('js', function(){
	return gulp.src('src/js/**/*')
	.pipe(gulp.dest('dist/js/'))
	.pipe(connect.reload());
});

gulp.task('css', function(){
	return sass('src/css/main.scss')
		.on('error', sass.logError)
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/css'))
		// .pipe(uncss({html: ['dist/index.html']}))
		.pipe(csscomb())
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
});

gulp.task('images', function() {
	return gulp.src('src/img/**/*')
		.pipe(imagemin({ optimizationLevel: 3,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			progressive: true,
			interlaced: true }))
		.pipe(gulp.dest('dist/img'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: 'dist/img/sprite.png',
    padding:10,
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('dist/img/')); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest('src/css/')); // путь, куда сохраняем стили
});


gulp.task('watch', function() {

// Watch any files in dist/, reload on change
gulp.watch('src/css/*.scss', ['css'])
gulp.watch('src/font/*', ['font'])
gulp.watch('src/js/*', ['js'])
gulp.watch('src/*.html', ['html'])
gulp.watch('src/template/*.html', ['html'])
});

gulp.task( 'build', ['html', 'font','css','js', 'connect', 'watch', 'sprite', 'images'])

gulp.task('default', ['html', 'css', 'js', 'connect','font', 'watch']);