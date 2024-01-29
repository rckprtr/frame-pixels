module.exports = {
    webpack: (config, { isServer }) => {
      // Configure node-loader to handle .node files
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
  
      // Exclude @napi-rs/canvas from client-side bundles
      if (!isServer) {
        config.externals = config.externals || [];
        config.externals.push('@napi-rs/canvas');
      }
  
      return config;
    },
  };