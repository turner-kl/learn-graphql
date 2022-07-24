const fetch = require('node-fetch');
const { authorizeWithGithub } = require('../lib');

const postPhoto = async (parent, args, { db, currentUser }) => {

    if (!currentUser) {
        throw new Error('only an authorized user can post a photo');
    }

    const newPhoto = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date()
    }

    const { insertedIds } = await db.collection('photos').insert(newPhoto);
    newPhoto.id = insertedIds[0];

    return newPhoto;
};

const githubAuth = async (parent, { code }, { db }) => {
    const { message, access_token, avatar_url, login, name } =
        await authorizeWithGithub({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        })

    if (message) throw new Error(message);

    const latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url
    }

    const { ops: [user] } = await db
        .collection('users').replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

    return { user, token: access_token };
};

const addFakeUsers = async (root, { count }, { db }) => {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;

    const { results } = await fetch(randomUserApi).then(res => res.json());

    const users = results.map(r => ({
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar: r.picture.thumbnail,
        githubToken: r.login.sha1
    }));

    await db.collection('users').insert(users);

    return users;
};

const fakeUserAuth = async (parent, { githubLogin }, { db }) => {
    const user = await db.collection('users').findOne({ githubLogin });

    if (!user) {
        throw new Error(`Cannot find user with githubLogin '${githubLogin}'`);
    }

    return {
        token: user.githubToken,
        user
    };
}

module.exports = { postPhoto, githubAuth, addFakeUsers };