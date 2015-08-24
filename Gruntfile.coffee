# Grunt Configuration
# http://gruntjs.com/getting-started#an-example-gruntfile

module.exports = (grunt) ->

	# Initiate the Grunt configuration.
	grunt.initConfig

		# Allow use of the package.json data.
		pkg: grunt.file.readJSON('package.json')

		# docpad variables
		docpad:
			files: [ './src/**/*.*' ]
			out: ['out']

		# PostCSS
		postcss:
			dev:
				options:
					map:
						inline: false
						annotation: 'out/css/'
					processors: [
						require('autoprefixer-core')({browsers: [
							'Android 2.3'
							'Android >= 4'
							'Chrome >= 20'
							'Firefox >= 24'
							'Explorer >= 9'
							'iOS >= 6'
							'Opera >= 12'
							'Safari >= 6'
						]})
					]
				dist:
					src: 'out/css/template.css'
			static:
				options:
					map:
						inline: false
						annotation: 'out/css/'
					processors: [
						require('autoprefixer-core')({browsers: [
							'Android 2.3'
							'Android >= 4'
							'Chrome >= 20'
							'Firefox >= 24'
							'Explorer >= 8'
							'iOS >= 6'
							'Opera >= 12'
							'Safari >= 6'
						]})
					]
				dist:
					src: 'out/css/output.min.css'

		# copy vendor files [destination:source]
		copy:
			main:
				files: [
					'out/vendor/modernizr.js':'bower_components/modernizr/modernizr.js'
					'out/vendor/jquery.min.js':'bower_components/jquery/dist/jquery.min.js'
					'out/vendor/jquery.min.map':'bower_components/jquery/dist/jquery.min.map'
					#'out/vendor/60fps-scroll.js':'bower_components/60fps-scroll/dist/60fps-scroll.js'
					'out/vendor/fastclick.js':'bower_components/fastclick/lib/fastclick.js'
					#'out/vendor/jquery.sticky.js':'bower_components/sticky/jquery.sticky.js'
					#'out/vendor/jquery.scrollTo/jquery.scrollTo.min.js':'bower_components/jquery.scrollTo/jquery.scrollTo.min.js'
					#'out/vendor/jquery.localScroll/jquery.localScroll.min.js':'bower_components/jquery.localScroll/jquery.localScroll.min.js'
				]
			repo:
				files: [
					'../BrCustomer/BrCustomerSite/Content/css/template.css' : 'out/css/template.css'
					'../BrCustomer/BrCustomerSite/Content/css/template.css.map' : 'out/css/template.css.map'
				]

		# compile less and generate map files
		less:
			out:
				options:
					strictMath: true
					sourceMap: true
					outputSourceFiles: true
					sourceMapURL: 'template.css.map'
					sourceMapFilename: 'out/css/template.css.map'
				files:
					'out/css/template.css': 'src/files/css/template.css.less'

		#minify css
		cssmin:
			combine:
				files:
					'out/css/output.min.css':[
						'out/vendor/normalize.css'
						'out/css/template.css'
					]

		# concat files
		concat:
			bootstrap:
				src: [
					'bower_components/bootstrap/js/transition.js',
					'bower_components/bootstrap/js/alert.js',
					'bower_components/bootstrap/js/button.js',
					'bower_components/bootstrap/js/carousel.js',
					'bower_components/bootstrap/js/collapse.js',
					'bower_components/bootstrap/js/dropdown.js',
					'bower_components/bootstrap/js/modal.js',
					'bower_components/bootstrap/js/tooltip.js',
					'bower_components/bootstrap/js/popover.js',
					'bower_components/bootstrap/js/scrollspy.js',
					'bower_components/bootstrap/js/tab.js',
					'bower_components/bootstrap/js/affix.js',
					'bower_components/jasny-bootstrap/js/offcanvas.js',
					'bower_components/jasny-bootstrap/js/inputmask.js',
					'bower_components/bootstrapValidator/dist/js/bootstrapValidator.js'
				]
				dest: 'out/vendor/bootstrap/js/bootstrap.js'

		#minify js
		uglify:
			out:
				files:
					'out/js/output.min.js':[
						'out/vendor/modernizr-custom.js'
						'out/vendor/jquery.min.js'
						#'out/vendor/jquery.sticky.js'
						'out/vendor/bootstrap/js/bootstrap.js'
						'out/vendor/fastclick.js'
						'out/js/init.js'
						#'out/vendor/60fps-scroll.js'
					]

		#minify html
		htmlmin:
			out:
				options:
					removeComments: true
					collapseWhitespace: true
					minifyJS: true
					minifyCSS: true
				files: [
					expand: true
					cwd: 'out/'
					src: [
						'*.html'
						'!google*.html'
						'!yandex*.html'
					]
					dest: 'out/'
				]

		# optimize images if possible
		imagemin:
			out:
				options:
					optimizationLevel: 2,
				files: [
					expand: true,
					cwd: 'out/img/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'out/img/'
				]
			src:
				options:
					optimizationLevel: 2,
				files: [
					expand: true,
					cwd: 'src/files/img/',
					src: ['**/*.{png,jpg,jpeg,gif,svg}'],
					dest: 'src/files/img/'
				]
			icons:
				options:
					optimizationLevel: 2,
				files: [
					expand: true,
					cwd: 'src/files/icons/svg/',
					src: ['**/*.svg'],
					dest: 'src/files/icons/svg/'
				]

		# Lint LESS files
		recess:
			dist:
				options:
					# Default
					compile: false              # Compiles CSS or LESS. Fixes white space and sort order.
					compress: false             # Compress your compiled code
					noIDs: true                 # Doesn't complain about using IDs in your stylesheets
					noJSPrefix: true            # Doesn't complain about styling .js- prefixed classnames
					noOverqualifying: true      # Doesn't complain about overqualified selectors (ie: div#foo.bar)
					noUnderscores: true         # Doesn't complain about using underscores in your class names
					noUniversalSelectors: true  # Doesn't complain about using the universal * selector
					prefixWhitespace: true      # Adds whitespace prefix to line up vender prefixed properties
					strictPropertyOrder: false   # Complains if not strict property order
					zeroUnits: true             # Doesn't complain if you add units to values of 0
					includePath: 'mixed'          # Additional paths to look for `@import`'ed LESS files.  Accepts a string or an array of strings.
				src: ['src/files/css/*.less']

		# HTML5 validation
		htmllint:
			all:
				expand: true
				cwd: 'out/'
				src: [
					'**/*.html'
					'!google*.html'
					'!yandex*.html'
				]


		#clean files
		clean:
			less:
				'out/css/*.less'

		#generates custom modernizr build from site css
		modernizr:
			dist:
				# [REQUIRED] Path to the build you're using for development.
				devFile: "bower_components/modernizr/modernizr.js"

				# Path to save out the built file.
				outputFile: "out/vendor/modernizr-custom.js"

				# Based on default settings on http://modernizr.com/download/
				extra:
					shiv: true
					printshiv: false
					load: true
					mq: true
					cssclasses: true

				# Based on default settings on http://modernizr.com/download/
				extensibility:
					addtest: false
					prefixed: false
					teststyles: false
					testprops: false
					testallprops: false
					hasevents: false
					prefixes: false
					domprefixes: false
					cssclassprefix: ""

				# By default, source is uglified before saving
				uglify: true

				# Define any tests you want to implicitly include.
				tests: []

				# By default, this task will crawl your project for references to Modernizr tests.
				# Set to false to disable.
				parseFiles: true

				# When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
				# except files that are in node_modules/.
				# You can override this by defining a "files" array below.
				files:
					src: [
						'src/documents/**/*.less'
						'src/documents/**/*.css'
						'src/documents/**/*.js'
					]

				# This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
				# handler: function (tests) {},

				# When parseFiles = true, matchCommunityTests = true will attempt to
				# match user-contributed tests.
				matchCommunityTests: true

				# Have custom Modernizr tests? Add paths to their location here.
				customTests: []

		#create one svg from multiple files
		svgstore:
			options:
				prefix: 'i--'
				#formatting:
				#   indent_size: 2
				includedemo: true
			default:
				options:
					cleanup: ['fill']
				files: 'src/files/icons/svg-defs.svg':['src/files/icons/svg/*.svg']

		#convert content of svg file to string
		svg2string:
			icons:
				files: 'src/files/icons/svg-icons.js':['src/files/icons/svg-defs.svg']


		'ftp-deploy':
			build:
				auth:
					host: ''
					port: 21
					authPath: '.ftppass'
					authKey: 'primary'
				src: 'out/'
				dest: '/www/'
				exclusions: [
					'out/**/.DS_Store'
					'out/**/Thumbs.db'
				]

		watch:
			less:
				files: ['src/files/css/**/*.less']
				tasks: ['less:out', 'postcss:dev', 'copy:repo']

	# Build the available Grunt tasks.
	grunt.loadNpmTasks 'grunt-contrib-less'
	grunt.loadNpmTasks 'grunt-contrib-cssmin'
	grunt.loadNpmTasks 'grunt-contrib-jshint'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-htmlmin'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-modernizr'
	grunt.loadNpmTasks 'grunt-ftp-deploy'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-newer'
	grunt.loadNpmTasks 'grunt-contrib-imagemin'
	grunt.loadNpmTasks 'grunt-recess'
	grunt.loadNpmTasks 'grunt-html'
	grunt.loadNpmTasks 'grunt-svgstore'
	grunt.loadNpmTasks 'grunt-svg2string'
	grunt.loadNpmTasks 'grunt-postcss'

	# Register our Grunt tasks.
	# grunt.registerTask 'deploy',        ['ftp-deploy']
	grunt.registerTask 'lint',          ['recess', 'htmllint']
	grunt.registerTask 'svgicons',      ['imagemin:icons', 'svgstore', 'svg2string']
	grunt.registerTask 'imageoptim',    ['newer:imagemin:src']
	grunt.registerTask 'production',    ['copy:main', 'less:out', 'postcss:static', 'cssmin', 'htmlmin', 'modernizr', 'uglify', 'imagemin:out', 'clean']
	grunt.registerTask 'watchless',     ['default', 'watch:less']
	grunt.registerTask 'default',       ['copy:main', 'concat', 'less:out', 'postcss:dev']
