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
    async headers() {
      return [
          {
              // matching all API routes
              source: "/api/:path*",
              headers: [
                  { key: "Access-Control-Allow-Credentials", value: "true" },
                  { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                  { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
              ]
          }
      ]
    }
  };