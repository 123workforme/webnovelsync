module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true,
        compress: true
      },
      dist: {
        files: {
          'dist/background.js': ['background.js'],
          'dist/popup.js': ['popup.js'],
          'dist/offscreen.js': ['offscreen.js'],
          'dist/inkstone_verification.js': ['inkstone_verification.js'],
          'dist/scribblehub_verification.js': ['scribblehub_verification.js'],
          'dist/webnovel_signin_check.js': ['webnovel_signin_check.js'],
          'dist/fanfiction_verification.js': ['fanfiction_verification.js'],
          'dist/ao3_verification.js': ['ao3_verification.js'],
          'dist/royalroad_verification.js': ['royalroad_verification.js'],
          'dist/wattpad_verification.js': ['wattpad_verification.js']
        }
      }
    },
    
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      dist: {
        files: {
          'dist/popup.css': ['popup.css']
        }
      }
    },
    
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true
        },
        files: {
          'dist/popup.html': 'popup.html'
        }
      }
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['manifest.json', 'icon.png', 'offscreen.html'],
            dest: 'dist/'
          }
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin', 'copy']);
};