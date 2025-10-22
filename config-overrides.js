const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

// Use the old/compatible function signature: only config and env
module.exports = function override(config, env) { 
    
    if (env === 'production') {
        
        // 1. Resolve the Service Worker source path reliably using process.cwd()
        // This is a reliable fallback when the { paths } object is missing.
        const swSourcePath = path.resolve(process.cwd(), 'service-worker.js');

        // 2. Filter out the default 'GenerateSW' plugin
        config.plugins = config.plugins.filter(
            (plugin) => plugin.constructor.name !== 'GenerateSW'
        );

        // 3. Add the 'InjectManifest' plugin
        config.plugins.push(
            new WorkboxWebpackPlugin.InjectManifest({
                swSrc: swSourcePath, 
                swDest: 'service-worker.js',
            })
        );
    }
    
    // 4. Return the fully modified Webpack configuration object
    return config;
};