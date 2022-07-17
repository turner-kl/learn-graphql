
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

const totalPhotos = () => photos.length;
const allPhotos = (parent, args) => photos;

module.exports = { totalPhotos, allPhotos }