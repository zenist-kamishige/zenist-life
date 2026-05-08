import type { NextConfig } from "next";                                                                                                                                                 
                                                                                                                                                                                          
  const nextConfig: NextConfig = {
    images: {                                                                                                                                                                             
      domains: ["res.cloudinary.com"],                                                                                                                                                  
    },
    async redirects() {
      return [
        {
          source: "/:slug((?!posts|about|asobu|nagomu|shira|toku|session|dome|_next)[^./]+)",
          destination: "/posts/:slug",                                                                                                                                                    
          permanent: true,
        },                                                                                                                                                                                
      ];                                                                                                                                                                                
    },
  };

  export default nextConfig;