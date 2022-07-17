let _id = 0;

const postPhoto = (parent, args) => {
    const newPhoto = {
        id: _id++,
        created: new Date(),
        ...args.input
    }
    photos.push(newPhoto);
    return newPhoto;
};

module.exports = { postPhoto };