# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

# Read

Medium Post [https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4]

TypeORM Offical [https://typeorm.io/]

https://softwareontheroad.com/ideal-nodejs-project-structure/

    docker:
      - image: circleci/node:11.10.0
      - image: circleci/mysql:latest
    steps:
      - checkout
      - run:
        name: "Update Node.js and Npm"
        command: |
          curl -sSL "https://nodejs.org/dist/v11.10.0/node-v11.10.0-linux-x64.tar.xz" | sudo tar --strip-components=2 -xJ -C /usr/local/bin/ node-v11.10.0-linux-x64/bin/node
          curl https://www.npmjs.com/install.sh | sudo bash
          