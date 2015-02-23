module.exports = function(grunt) {

// 1. Toutes les configurations vont ici: 
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
       build :{
			src: 'js/minify/DirectionCtrlConcat.js',
			dest: 'js/minify/DirectionCtrlMini.js'
		}
       
    }

});

// 3. Nous disons à Grunt que nous voulons utiliser ce plug-in.
grunt.loadNpmTasks('grunt-contrib-uglify');

// 4. Nous disons à Grunt quoi faire lorsque nous tapons "grunt" dans la console.
grunt.registerTask('default', ['uglify']);

};
