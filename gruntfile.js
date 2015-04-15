module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.initConfig({
    clean: ["public/js"],
    uglify: {
      my_target: {
        options: {
          mangle: false
        },
        files: {
          'public/js/script.js': ['js/script.js'],
          'public/js/controllers.js': ['js/controllers.js'],
          'public/js/app.js': ['js/app.js'],
          'public/js/services.js': ['js/services.js']
        } //files
      } //my_target
    }, //uglify
    copy: {
      files: {
            expand : true,
            dest   : 'public/js',
            cwd    : 'js',
            src    : [
              '**/*.js'
            ]
      }
    },
    compass: {
      dev: {
        options: {
          config: 'compass_config.rb'
        } //options
      }, //dev

      bootstrap: {
        options: {
          config: 'compass_bootstrap_config.rb'
        } //options
      } //bootstrap

    }, //compass
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['js/*.js'],
        //tasks: ['clean','uglify'],
        tasks: ['copy']
      }, //script
      sass: {
        files: ['sass/*.scss'],
        tasks: ['compass:dev','compass:bootstrap']
      }, //sass

      sass_bootstrap: {
        files: ['public/bootstrap/assets/stylesheets/bootstrap.scss','public/bootstrap/assets/stylesheets/bootstrap/*.scss', 'public/bootstrap/assets/stylesheets/bootstrap/mixins/*.scss'],
        tasks: ['compass:bootstrap']
      },
      html: {
        files: ['public/*.html', 'public/partials/*.html']
      }
    }, //watch
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app.js'
        }
      }
  }
  }) //initConfig
  grunt.registerTask('default', ['express:dev', 'watch']);
} //exports
