require({
    urlArgs: "t=" + (new Date()).getTime(),
    paths: {
        "jquery": "libs/jquery",
        "knockout": "libs/knockout",
        "text": "libs/require.text"
    },
    config: {
        "main": {
        },
        "components/app/app": {
            components: {
            }
        }
    }
}, ["main"]);