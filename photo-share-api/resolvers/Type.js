const { GraphQLScalarType } = require('graphql');

const Type = {
    Photo: {
        id: parent => parent.id || parent._id,
        url: parent => `/img/photos/${parent._id}.jpg`,
        postedBy: (parent, args, { db }) =>
            db.collection('users').findOne({ githubLogin: parent.userID }),
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

module.exports = Type;