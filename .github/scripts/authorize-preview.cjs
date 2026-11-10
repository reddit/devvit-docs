module.exports = async function authorizePreview({ github, context, core }) {
  const { issue, comment } = context.payload;
  if (!issue?.pull_request || !['preview', '/preview'].includes(comment?.body)) {
    core.setFailed('Expected a preview request on a pull request.');
    return;
  }

  const { owner, repo } = context.repo;
  const actor = comment.user.login;
  let permission = 'none';
  try {
    const { data } = await github.rest.repos.getCollaboratorPermissionLevel({
      owner, repo, username: actor,
    });
    permission = data.permission;
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  if (!['admin', 'maintain', 'write'].includes(permission)) {
    core.setFailed(`Preview builds require repository write access. ${actor} has ${permission} access.`);
    return;
  }

  const { data: pull } = await github.rest.pulls.get({
    owner, repo, pull_number: issue.number,
  });
  if (pull.state !== 'open' || !pull.head.repo || !/^[a-f0-9]{40}$/.test(pull.head.sha)) {
    core.setFailed('The pull request must be open and have an available head commit.');
    return;
  }

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const runUrl = `${serverUrl}/${owner}/${repo}/actions/runs/${context.runId}`;
  await github.rest.issues.createComment({
    owner, repo, issue_number: issue.number,
    body: [
      `Preview requested for \`${pull.head.sha.slice(0, 12)}\`.`,
      '',
      `[Open the preview run](${runUrl}). When ready, the \`Start preview tunnel\` log shows the live preview URL.`,
      '',
      'The preview stays available for up to six hours. Comment `preview` again to replace it.',
    ].join('\n'),
  });

  core.setOutput('head_repo', pull.head.repo.full_name);
  core.setOutput('head_sha', pull.head.sha);
};
