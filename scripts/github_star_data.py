import requests
import json
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from loguru import logger
from rich.console import Console
from tenacity import retry, stop_after_attempt, wait_exponential
import typer

console = Console()

class StarHistory(BaseModel):
    date: datetime
    stars: int

class RepositoryData(BaseModel):
    repo_name: str
    star_count: int
    star_history: List[StarHistory]

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def fetch_star_data(repo_owner: str, repo_name: str, token: str) -> RepositoryData:
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    query = """
    query ($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
            stargazers(first: 100, orderBy: {field: STARRED_AT, direction: ASC}) {
                edges {
                    starredAt
                }
            }
            stargazerCount
        }
    }
    """

    variables = {
        "owner": repo_owner,
        "name": repo_name
    }

    response = requests.post(
        'https://api.github.com/graphql',
        headers=headers,
        json={"query": query, "variables": variables}
    )

    if response.status_code != 200:
        raise Exception(f"Query failed to run by returning code of {response.status_code}. {query}")

    result = response.json()
    star_history = [
        StarHistory(date=edge['starredAt'], stars=1)
        for edge in result['data']['repository']['stargazers']['edges']
    ]

    return RepositoryData(
        repo_name=f"{repo_owner}/{repo_name}",
        star_count=result['data']['repository']['stargazerCount'],
        star_history=star_history
    )

def save_star_data(data: RepositoryData, file_path: str):
    with open(file_path, 'w') as f:
        json.dump(data.dict(), f, indent=4, default=str)

def main(repo_owner: str, repo_name: str, token: str, file_path: str):
    logger.add("github_star_data.log", rotation="1 MB")
    logger.info("Fetching star data for {}/{}", repo_owner, repo_name)
    star_data = fetch_star_data(repo_owner, repo_name, token)
    save_star_data(star_data, file_path)
    logger.info("Star data saved to {}", file_path)
    console.print(f"Star data for {repo_owner}/{repo_name} saved to {file_path}", style="bold green")

if __name__ == "__main__":
    typer.run(main)
