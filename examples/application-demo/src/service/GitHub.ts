const REPOS_URL = "https://api.github.com/repos/Simplr/simplr-router";


export async function getRepositoryData() {
    const res = await fetch(REPOS_URL).then(res => res.json());
    return res;
}
