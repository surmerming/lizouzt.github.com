module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> dev by Tao Z.*/\n'
            },
            build: {
                src: 'src/js/<%=pkg.name %>.js',
                dest: 'build/css/<%= pkg.name %>.min.js'
            }               
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            minify: {
                expand: true,
                cwd: 'resources/css/',
                src: ['*.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 默认任务
    grunt.registerTask('default', ['uglify', 'cssmin']);
}
