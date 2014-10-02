'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		uglify : {
			options : {
				mangle : false
			},
			my_target : {
				files : {
					'Saorsa.Utils/dist/saorsa.angular.infrastructure.min.js' : ['Saorsa.Utils/Bootstrap.js', 'Saorsa.Utils/Utils.Interceptors.js', 'Saorsa.Utils/Utils.js']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify']);
};
