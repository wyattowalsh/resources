# Resource Collection

A beautifully stylized collection of resources.

## Resources

### [Next.js Documentation](https://nextjs.org/docs)
Comprehensive guide and documentation for Next.js framework.

### [TailwindCSS Documentation](https://tailwindcss.com/docs)
Utility-first CSS framework for rapid UI development.

### [Framer Motion Documentation](https://www.framer.com/motion/)
A production-ready motion library for React.

### [shadcn-ui Documentation](https://shadcn.dev/docs)
A collection of beautifully designed components for React.

## GitHub Star Components

### GitHub Star Count
The `GitHubStarCount` component displays the current star count of a GitHub repository. It uses the GitHub GraphQL API to fetch the star count and updates it nightly via a GitHub Action.

#### Usage
```jsx
import GitHubStarCount from './components/GitHubStarCount';

const App = () => (
  <div>
    <GitHubStarCount repo="owner/repo" />
  </div>
);

export default App;
```

### GitHub Star Graph
The `GitHubStarGraph` component displays the star history graph of a GitHub repository. It uses the GitHub GraphQL API to fetch the star history and displays it in a dropdown.

#### Usage
```jsx
import GitHubStarGraph from './components/GitHubStarGraph';

const App = () => (
  <div>
    <GitHubStarGraph repo="owner/repo" />
  </div>
);

export default App;
```

## GitHub Actions Workflow

### Update Star Data
The `update-star-data.yml` workflow fetches the star data of a GitHub repository using the GitHub GraphQL API and saves it to `data/star-data.json`. The workflow is scheduled to run nightly.

#### Setup
1. Create a new file at `.github/workflows/update-star-data.yml`.
2. Add the following content to the file:
```yaml
name: Update Star Data

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  update-star-data:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.13'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Fetch GitHub Star Data
        run: |
          python scripts/github_star_data.py

      - name: Commit and Push Changes
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add data/star-data.json
          git commit -m 'Update star data'
          git push
```
3. Ensure you have a `data` directory at the root of your repository with a `star-data.json` file.
4. The workflow will run nightly and update the star data.
