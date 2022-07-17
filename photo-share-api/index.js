const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');

const typeDefs = `
    scalar DateTime

    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    type Photo {
        id: ID!
        created: DateTime!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
        taggedUsers: [User!]!
    }

    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
        inPhotos: [Photo!]!
    }

    type Query {
        totalPhotos: Int!
        allPhotos(after: DateTime): [Photo!]!
    }

    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }
    
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

let _id = 0;
const users = [
    { "githubLogin": "test1", "name": "Mike1" },
    { "githubLogin": "test2", "name": "Mike2" },
    { "githubLogin": "test3", "name": "Mike3" },
]
const photos = [
    {
        id: "1",
        name: "derog",
        description: "test",
        category: "ACTION",
        created: "3-28-2022",
        githubUser: "test1"
    },
    {
        id: "2",
        name: "derog",
        description: "test",
        category: "ACTION",
        created: "4-28-2022",
        githubUser: "test2"
    },
    {
        id: "3",
        name: "derog",
        description: "test",
        category: "ACTION",
        created: "5-28-2022",
        githubUser: "test3"
    }
];
const tags = [
    { "photoID": "1", "userID": "test1" },
    { "photoID": "2", "userID": "test2" },
    { "photoID": "2", "userID": "test3" },
]
const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: (parent, args) => photos
    },
    Mutation: {
        postPhoto(parent, args) {
            const newPhoto = {
                id: _id++,
                created: new Date(),
                ...args.input
            }
            photos.push(newPhoto);
            return newPhoto;
        }
    },
    Photo: {
        url: parent => `https://example.com/${parent.id}.jpg`,
        postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
        taggedUsers: parent => tags
            .filter(tag => tag.photoID === parent.id)
            .map(tag => tag.userID)
            .map(userID => users.find(u => u.githubLogin === userID))
    },
    User: {
        postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubLogin),
        inPhotos: parent => tags
            .filter(tag => tag.userID === parent.id)
            .map(tag => tag.photoID)
            .map(photoID => photos.find(p => p.id === photoID))
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTIme',
        description: "A valid date time value",
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString(),
        parseLiteral: ast => ast.value
    })
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`GraphQL Service running on ${url}`));