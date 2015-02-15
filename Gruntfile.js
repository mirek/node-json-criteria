
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
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/json-criteria.js': [ 'src/**/*.js' ]
        },
        options: {
          transform: [ 'babelify' ]
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
    babel: {
      options: {
        sourceMap: true
      },
      lib: {
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
    clean: {
      lib: 'lib',
      dist: 'dist'
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: [ 'babel/register' ]
        },
        src: [ 'spec/**/*.js' ]
      }
    }
  })

  grunt.registerTask('test', [ 'mochaTest' ])

  grunt.registerTask('compile', [
    'babel', 'browserify', 'uglify', 'copy:version'
  ])

  grunt.registerTask('recompile', [ 'clean', 'compile' ])

  grunt.registerTask('default', [ 'recompile', 'test' ])

}
