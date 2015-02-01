'use strict';
module.exports = function(grunt) {

  require('jit-grunt')(grunt, { });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "babel": {
      dist: {
        files: [{
          expand: true,
          cwd: 'lib/',
          src: '**/*.js',
          dest: 'dist/<%= pkg.name %>/'
        }]

      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'babel/register'
      },
      src: ['test/**/*.test.js']
    },
    jshint: {
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
      lib: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['lib/**/*.js']
      }
    },
    watch: {
      files: ['lib/**/*.js', 'test/**/*.js'],
      tasks: ['jshint', 'mochaTest']
    }
  });

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('build', ['babel:dist']);

  grunt.registerTask('default', ['test', 'build']);

};
