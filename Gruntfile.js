
module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt)

  grunt.initConfig({
    "6to5": {
      options: {
        sourceMap: false
      },
      lib: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.js'],
            dest: 'lib'
          }
        ]
      }
    },
    clean: {
      lib: 'lib'
    },
    watch: {
      coffee: {
        files: ['src/**/*.js'],
        tasks: ['coffee']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: ['6to5/register']
        },
        src: ['spec/**/*.js']
      }
    }
  })

  grunt.registerTask('test', ['mochaTest'])
  grunt.registerTask('compile', ['6to5:lib'])
  grunt.registerTask('recompile', ['clean:lib', 'compile'])
  grunt.registerTask('default', ['recompile'])
}
