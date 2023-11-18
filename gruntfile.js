module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'danvisibleman+screepsslava@gmail.com',
                token: '243991a0-57cb-4cf4-9ca5-6b245e935160',
                branch: 'default',
                server: 'ptr',
                ptr: true
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
}


/*module.exports = function (grunt) {

    require('time-grunt')(grunt);
    
    var config = require('./screeps.json');


    var token = grunt.option('token') || config.token;
    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr
    var private_directory = grunt.option('private_directory') || config.private_directory;

    var currentDate = new Date();

    grunt.log.subhead('Task Start: ' + currentDate.toLocaleString());
    grunt.log.writeln('Branch: ' + branch);

    
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-rsync');

    grunt.initConfig({
        screeps: {
            options: {
                email: email,//'danvisibleman+screepsslava@gmail.com',
                password: password,
                token: token,//'243991a0-57cb-4cf4-9ca5-6b245e935160',
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['src/*.js']
            }
        },

        clean: {
            'dist': ['dist']
        },

        copy: {
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {

                        return dest + src.replace(/\//g, '_');
                    }
                }],
            }
        },

        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true
            },
            private: {
                options: {
                    src: './dist/',
                    dest: private_directory
                }
            },
        },

        file_append: {
            versioning: {
                files: [{
                    append: "\nglobal.SCRIPT_VERSION = " + currentDate.getTime() + "\n",
                    input: './dist/version.js'
                }]
            }
        },

        jsbeautifier: {
            modify: {
                src: ["src/**//*.js"],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: ["src/**//*.js"],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy:screeps', 'screeps']);
    grunt.registerTask('private', ['clean', 'copy:screeps', 'screeps', 'rsync:private']);
    //grunt.registerTask('default', ['clean', 'copy:screeps', 'file_append:versioning', 'screeps']);
    //grunt.registerTask('private', ['clean', 'copy:screeps', 'file_append:versioning', 'screeps', 'rsync:private']);

    grunt.registerTask('test',      ['jsbeautifier:verify']);
    grunt.registerTask('pretty',    ['jsbeautifier:modify']);
}*/