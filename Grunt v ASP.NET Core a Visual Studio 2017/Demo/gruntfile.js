/// <binding AfterBuild='buildTask' Clean='cleanTask' />
module.exports = function (grunt) {
    // Konfigurácia grunt taskov
    grunt.initConfig({
        clean: {
            css: [
                "wwwroot/css/*"
            ],
            js: [
                "wwwroot/js/*"
            ],
            cssmin: [
                "wwwroot/css/*",
                "!wwwroot/css/site.min.css"
            ],
            html: [
                "wwwroot/js/components/**/*.html"
            ],
            config: [
                "wwwroot/js/config.js"
            ]
        },
        copy: {
            css: {
                files: [{
                    expand: true,
                    cwd: "css/",
                    src: ["**"],
                    dest: "wwwroot/css/",
                    filter: "isFile"
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: "js/",
                    src: ["**", "!**/*.less"],
                    dest: "wwwroot/js/",
                    filter: "isFile"
                }]
            }
        },
        concat: {
            css: {
                options: {
                    process: function (src, filepath) {
                        var fileName = filepath.split("/");
                        return '/**\n * ' + fileName[fileName.length - 1].replace(".min.css", "") + '\n */\n' + src;
                    }
                },
                src: [
                    "wwwroot/css/site.min.css",
                    "wwwroot/css/app.min.css"
                ],
                dest: "wwwroot/css/site.min.css"
            }
        },
        less: {
            options: {
                paths: ["less"],
                strictMath: false
            },
            src: {
                files: {
                    "wwwroot/css/site.css": "less/site.less",
                    "wwwroot/css/app.css": "js/components/app/app.less"
                }
            }
        },
        csslint: {
            options: {
                "universal-selector": false,
                "order-alphabetical": false,
                "outline-none": false
            },
            src: [
                "wwwroot/css/**/*.css",
                "!wwwroot/css/**/*.min.css"
            ]
        },
        cssmin: {
            options: {
            },
            build: {
                files: [{
                    expand: true,
                    cwd: "wwwroot/css",
                    src: ["*.css", "!*.min.css"],
                    dest: "wwwroot/css",
                    ext: ".min.css"
                }]
            }
        },
        jshint: {
            options: {
                debug: true,
                multistr: true,
                sub: true,
                laxbreak: true,
                globals: {
                    jQuery: true
                }
            },
            src: [
                "gruntfile.js",
                "js/**/*.js",
                "!js/libs/*.js"
            ]
        },
        htmllint: {
            options: {
                path: false,
                force: true,
                reportpath: false,
                ignore: [
                    /^Empty heading.*/,
                    /^Start tag seen without seeing a doctype first*/,
                    /is missing a required instance of child element/
                ]
            },
            src: [
                "js/**/*.html"
            ]
        },
        requirejs: {
            release: {
                options: {
                    appDir: "./wwwroot",
                    skipDirOptimize: true,
                    writeBuildTxt: false,
                    baseUrl: "./js",
                    dir: "./wwwroot",
                    keepBuildDir: true,
                    allowSourceOverwrites: true,
                    removeCombined: true,
                    preserveLicenseComments: false,
                    optimize: "uglify",
                    inlineText: true,
                    optimizeCss: "none",
                    skipModuleInsertion: false,
                    paths: {
                        "jquery": "./libs/jquery",
                        "knockout": "./libs/knockout",
                        "text": "./libs/require.text"
                    },
                    stubModules: ["text"],
                    modules: [{
                        name: "main",
                        create: true,
                        stubModules: ["text"],
                        include: [
                            "main",
                            "components/app/app"
                        ]
                    }]
                }
            }
        },
        uglify: {
            options: {
                stripBanners: false,
                sourceMap: false
            },
            release: {
                files: [{
                    expand: true,
                    cwd: "wwwroot/js",
                    src: [
                        "**/*.js",
                        "!*.min.js"
                    ],
                    dest: "wwwroot/js"
                }]
            }
        }
    });

    // Načítanie grunt modulov
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-html");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Zaregistrovanie vlastných taskov
    grunt.registerTask("cleanTask", cleanTask);
    grunt.registerTask("buildTask", buildTask);

    // Clean task
    function cleanTask() {
        // Toto je len informačný výpis do konzoly
        grunt.log.writeln("Running \"cleanTask\"");

        // Zoznam grunt taskov, ktoré sa majú vykonať
        var tasks = [
            "clean:css"
        ];

        // Spustíme tasky
        grunt.task.run.apply(grunt.task, tasks);
    }

    // Build task
    function buildTask() {
        // Načítanie obsahu súboru buildConfiguration.json
        var configuration = grunt.file.readJSON("buildConfiguration.json").configuration;

        // Toto je len informacný výpis do konzoly
        grunt.log.writeln("Running \"buildTask\" task using configuration \"" + configuration + "\"");

        // Zoznam grunt taskov, ktoré sa majú vykonat
        var tasks = [];

        // Rôzne grunt tasky v závislosti od konfigurácie
        switch (configuration.toUpperCase()) {
            case "DEBUG":
                tasks.push("copy:css");
                tasks.push("less");
                tasks.push("csslint");
                tasks.push("jshint");
                tasks.push("htmllint");
                tasks.push("copy:js");
                break;
            case "RELEASE":
                grunt.config("jshint.options.debug", false);

                tasks.push("copy:css");
                tasks.push("less");
                tasks.push("csslint");
                tasks.push("jshint");
                tasks.push("htmllint");
                tasks.push("cssmin");
                tasks.push("concat:css");
                tasks.push("clean:cssmin");
                tasks.push("copy:js");
                tasks.push("requirejs:release");
                tasks.push("clean:html");
                tasks.push("clean:config");
                tasks.push("uglify:release");
                break;
            default:
                grunt.fail.fatal("Unknown build configuration '" + configuration + "'");
                break;
        }

        // Run tasks
        grunt.task.run.apply(grunt.task, tasks);
    }
};