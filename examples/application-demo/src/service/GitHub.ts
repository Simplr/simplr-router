const ROUTER_REPO_URL = "https://api.github.com/repos/Simplr/simplr-router";

export async function getIssues() {
    return fetch(ROUTER_REPO_URL + "/issues")
        .then(res => res.json())
        .catch(err => {
            console.error("Can't fetch data", err);
            return [];
        })
}

export async function getIssue(issueNumber: number) {
    return fetch(ROUTER_REPO_URL + "/issues/" + issueNumber)
        .then(res => res.json())
        .catch(err => {
            console.error("Can't fetch data", err);
            return [];
        })
}

export async function getCommits() {
    return fetch(ROUTER_REPO_URL + "/commits")
        .then(res => res.json())
        .catch(err => {
            console.error("Can't fetch data", err);
            return [];
        })
}

export async function getCommit(sha: string) {
    return fetch(ROUTER_REPO_URL + "/commits/" + sha)
        .then(res => res.json())
        .catch(err => {
            console.error("Can't fetch data", err);
            return [];
        })
}
