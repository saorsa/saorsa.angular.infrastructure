'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'Saorsa.Utils/dist/saorsa.angular.infrastructure.min.js': ['Saorsa.Utils/Bootstrap.js', 'Saorsa.Utils/Utils.Interceptors.js', 'Saorsa.Utils/Utils.js']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: ['dots', 'junit'],
                junitReporter: {
                    outputFile: 'test-results.xml'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('cibuild', ['karma:continuous']);
};
