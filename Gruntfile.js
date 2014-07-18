module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    ui: 'tdd',
                    reporter: 'spec'
                },
                src: ['tests/**/*.js']
            }
        }

    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['mochaTest']);
};