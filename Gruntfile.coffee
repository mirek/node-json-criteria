
module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-mocha-test'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    clean:
      lib: 'lib'

    coffee:
      compile:
        expand: true
        cwd: 'src'
        src: '**/*.coffee'
        dest: 'lib'
        ext: '.js'

    watch:
      coffee:
        files: [ 'src/**/*.coffee' ]
        tasks: [ 'coffee' ]

    mochaTest:
      test:
        options:
          reporter: 'spec'
          require: [
            'coffee-script'
          ]
        src: [ 'spec/**/*.coffee' ]

  grunt.registerTask 'test', [ 'mochaTest' ]
  grunt.registerTask 'compile', [ 'clean:lib', 'coffee' ]
  grunt.registerTask 'default', [ 'compile' ]
