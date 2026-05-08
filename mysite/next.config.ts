import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;import type { NextConfig } from "next";                                                                                                                                                 
                                                                                                                                                                                        
  const nextConfig: NextConfig = {
    images: {
      domains: ["res.cloudinary.com"],
    },                                                                                                                                                                                    
    async redirects() {
      return [                                                                                                                                                                            
        {                                                                                                                                                                               
          source: "/:slug((?!posts|about|asobu|nagomu|shira|toku|session|dome).*)",
          destination: "/posts/:slug",                                                                                                                                                    
          permanent: true,
        },                                                                                                                                                                                
      ];                                                                                                                                                                                
    },
  };

  export default nextConfig;