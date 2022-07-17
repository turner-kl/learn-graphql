const Query = require('./Query.js');
const Mutation = require('./Mutation.js');
const Type = require('./Type.js');

const resolvers = {
    Query,
    Mutation,
    ...Type
};

module.exports = resolvers;