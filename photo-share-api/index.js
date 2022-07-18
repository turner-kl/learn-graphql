const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
const resolvers = require('./resolvers');

const start = async () => {
    const app = express();

    const MONGO_DB = process.env.DB_HOST;
    const client = await MongoClient.connect(MONGO_DB,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db();

    const context = { db };

    const server = new ApolloServer({ typeDefs, resolvers, context });
    server.applyMiddleware({ app });

    app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
    app.get('/playground', expressPlayground({ endpoint: 'graphql' }));

    app.listen({ port: 4000 },
        () => console.log(`GraphQL server running @ http://localhost:4000${server.graphqlPath}`));
}

start();