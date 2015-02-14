
module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      version: {
        files: {
          'dist/json-criteria-<%= pkg.version %>.js': 'dist/json-criteria.js',
          'dist/json-criteria-<%= pkg.version %>.min.js':
            'dist/json-criteria.min.js'
        }
      },
      es6: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [ '**/*.js' ],
            dest: 'lib'
          }
        ]
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/json-criteria.js': [ 'src/**/*.js' ]
        },
        options: {
          transform: [ '6to5ify' ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/json-criteria.min.js': [ 'dist/json-criteria.js' ]
        }
      }
    },
    "6to5": {
      options: {
        sourceMap: false
      },
      lib: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [ '**/*.js' ],
            dest: '6to5'
          }
        ]
      }
    },
    clean: {
      lib: 'lib',
      dist: 'dist',
      '6to5': '6to5'
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: [ '6to5/register' ]
        },
        src: [ 'spec/**/*.js' ]
      }
    }
  })

  grunt.registerTask('test', [ 'mochaTest' ])

  grunt.registerTask('compile', [
    'copy:es6', '6to5', 'browserify', 'uglify', 'copy:version'
  ])

  grunt.registerTask('recompile', [ 'clean', 'compile' ])

  grunt.registerTask('default', [ 'recompile', 'test' ])

}
