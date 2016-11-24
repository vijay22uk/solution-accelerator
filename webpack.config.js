var path = require("path");
module.exports = {
    context: __dirname,
    entry: path.resolve(__dirname, '/web/index.js'),
    output: {
        path: __dirname + "/web/public/js",
        filename: "bundle.js"
    },
    module: {
        loaders: [{
           exclude: /(node_modules|server|public)/,
            loader: 'babel'
            
        }]
    }
}