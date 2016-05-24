var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	notify = require('gulp-notify'),
	spritesmith = require('gulp.spritesmith'),
	uncss = require('gulp-uncss'),
	csscomb = require('gulp-csscomb'),
	rename      = require('gulp-rename'),
	cssnano     = require('gulp-cssnano'),
	connect = require('gulp-connect'),
	rigger = require('gulp-rigger'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	del = require('del'),
	cache= require('gulp-cache'),
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


gulp.task('js-libs', function() {
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
        .pipe(connect.reload());
});

gulp.task('js', function(){
	return gulp.src('src/js/*')
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

gulp.task('css-libs', function() {
	return sass('src/css/libs.scss')
		.on('error', sass.logError)
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
});

gulp.task('images', function() {
	return gulp.src(['src/img/*', '!src/img/icons'])
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


gulp.task('watch',['js-libs'], function() {

// Watch any files in dist/, reload on change
gulp.watch('src/css/*.scss', ['css'])
gulp.watch('src/css/libs.scss', ['css-libs'])
gulp.watch('src/font/*', ['font'])
gulp.watch('src/js/*', ['js'])
gulp.watch('src/*.html', ['html'])
gulp.watch('src/template/*.html', ['html'])
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

gulp.task( 'build', ['html', 'font','css','css-libs','js','js-libs', 'sprite', 'images']);

gulp.task('default', ['html','connect', 'watch']);