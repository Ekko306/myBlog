module.exports = function(grunt) {
  grunt.config.set('sync', {
    // Synchronize images and fonts
    dev: {
      files: [{
        cwd: 'source/_images',
        src: ['**/*'],
        dest: 'source/assets/images'
      }, {
        cwd: 'source/fonts',
        src: ['**/*'],
        dest: 'source/assets/fonts'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-sync');
};
