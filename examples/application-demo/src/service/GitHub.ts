const ROUTER_REPO_URL = "https://api.github.com/repos/Simplr/simplr-router";


export async function getRepositoryData() {
}

export async function getIssues() {
    return fetch(ROUTER_REPO_URL + "/issues")
        .then(res => res.json())
        .catch(err => {
            console.error("Can't fetch data", err);
            return [];
        })
}
