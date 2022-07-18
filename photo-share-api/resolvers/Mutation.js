const { authorizeWithGithub } = require('../lib');

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
}

module.exports = { postPhoto, githubAuth };