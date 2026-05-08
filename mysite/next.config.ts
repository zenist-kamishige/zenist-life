import type { NextConfig } from "next";                                                                                                                                                 
                                                                                                                                                                                        
  const nextConfig: NextConfig = {                                                                                                                                                        
    images: {
      domains: ["res.cloudinary.com"],                                                                                                                                                    
    },                                                                                                                                                                                  
    async redirects() {
      return [
        {
          source: "/nagomu-:slug",
          destination: "/posts/nagomu-:slug",                                                                                                                                             
          permanent: true,
        },                                                                                                                                                                                
        {                                                                                                                                                                               
          source: "/asobu-:slug",
          destination: "/posts/asobu-:slug",
          permanent: true,
        },
        {
          source: "/:slug((?!posts|about|asobu|nagomu|shira|toku|session|dome|_next)[^./]+)",
          destination: "/posts/:slug",
          permanent: true,
        },                                                                                                                                                                                
      ];
    },                                                                                                                                                                                    
  };                                                                                                                                                                                    

  export default nextConfig;