const config = { jwtSecret: "" };

config.jwtSecret = process.env.JWT_SECRET || "@Holla-C'estQui";

  
export default config;
