const totalPhotos = (parent, args, { db }) =>
    db.collection('photos').estimatedDocumentCount();

const allPhotos = (parent, args, { db }) =>
    db.collection('photos').find().toArray();

const totalUsers = (parent, args, { db }) =>
    db.collection('users').estimatedDocumentCount();

const allUsers = (parent, args, { db }) =>
    db.collection('users').find().toArray();

const me = (parent, args, { currentUser }) => currentUser;

module.exports = {
    totalPhotos,
    allPhotos,
    totalUsers,
    allUsers,
    me
}