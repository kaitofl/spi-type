import type { NextConfig } from 'next';

// GitHub Pages serves project sites below the repository name.  Keep the
// existing Sites deployment at the domain root, while making Pages builds use
// the correct asset path.
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
};

export default nextConfig;
