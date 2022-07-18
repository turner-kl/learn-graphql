const fetch = require('node-fetch');

const requestGithubToken = credentials =>
    fetch(
        'https://github.com/login/oauth/access_token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(credentials)
        }
    )
        .then(res => res.json())
        .catch(e => { throw new Error(JSON.stringify(e)) })

const requestGithubUserAccount = token =>
    fetch(`https://api.github.com/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .catch(e => { throw new Error(JSON.stringify(e)) })

const authorizeWithGithub = async (credentials) => {
    const { access_token } = await requestGithubToken(credentials);
    const githubUser = await requestGithubUserAccount(access_token);
    return { ...githubUser, access_token };
}

module.exports = { authorizeWithGithub }