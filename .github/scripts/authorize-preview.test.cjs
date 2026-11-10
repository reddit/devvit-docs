const assert = require('node:assert/strict');
const { test } = require('node:test');
const authorize = require('./authorize-preview.cjs');

const sha = 'a'.repeat(40);
function fixture({ permission = 'write', permissionError, state = 'open', headRepo = { full_name: 'contributor/fork' }, headSha = sha, body = 'preview', isPr = true } = {}) {
  const calls = [];
  const outputs = {};
  const failures = [];
  return {
    calls, outputs, failures,
    context: {
      repo: { owner: 'reddit', repo: 'devvit-docs' }, runId: 123,
      payload: { issue: { number: 42, ...(isPr ? { pull_request: {} } : {}) }, comment: { body, user: { login: 'requester' } } },
    },
    core: { setFailed: message => failures.push(message), setOutput: (name, value) => { outputs[name] = value; } },
    github: { rest: {
      repos: { getCollaboratorPermissionLevel: async () => { calls.push('permission'); if (permissionError) throw permissionError; return { data: { permission } }; } },
      pulls: { get: async () => { calls.push('pull'); return { data: { state, head: { repo: headRepo, sha: headSha, ref: 'mutable-branch' } } }; } },
      issues: { createComment: async data => { calls.push({ comment: data }); } },
    } },
  };
}

test('authorizes each writer role and pins the fork commit rather than a branch', async () => {
  for (const permission of ['write', 'maintain', 'admin']) {
    const f = fixture({ permission });
    await authorize(f);
    assert.deepEqual(f.outputs, { head_repo: 'contributor/fork', head_sha: sha });
    assert.equal(f.failures.length, 0);
    const comment = f.calls.find(call => call.comment).comment;
    assert.equal(comment.issue_number, 42);
    assert.match(comment.body, /https:\/\/github\.com\/reddit\/devvit-docs\/actions\/runs\/123/);
    assert.match(comment.body, /Start preview tunnel/);
  }
});

test('accepts the explicit slash command', async () => {
  const f = fixture({ body: '/preview' });
  await authorize(f);
  assert.equal(f.outputs.head_sha, sha);
});

test('read and triage permissions cannot authorize builds or post comments', async () => {
  for (const permission of ['read', 'triage', 'none']) {
    const f = fixture({ permission });
    await authorize(f);
    assert.deepEqual(f.calls, ['permission']);
    assert.deepEqual(f.outputs, {});
    assert.equal(f.failures.length, 1);
  }
});

test('a missing collaborator is rejected', async () => {
  const f = fixture({ permissionError: { status: 404 } });
  await authorize(f);
  assert.deepEqual(f.calls, ['permission']);
  assert.deepEqual(f.outputs, {});
  assert.equal(f.failures.length, 1);
});

test('permission API failures fail closed', async () => {
  const f = fixture({ permissionError: new Error('API unavailable') });
  await assert.rejects(authorize(f), /API unavailable/);
  assert.deepEqual(f.outputs, {});
  assert.deepEqual(f.calls, ['permission']);
});

test('ordinary comments and issues cannot start a preview', async () => {
  for (const options of [{ body: 'looks good' }, { isPr: false }]) {
    const f = fixture(options);
    await authorize(f);
    assert.deepEqual(f.calls, []);
    assert.deepEqual(f.outputs, {});
    assert.equal(f.failures.length, 1);
  }
});

test('closed PRs, deleted forks and malformed SHAs are rejected', async () => {
  for (const options of [{ state: 'closed' }, { headRepo: null }, { headSha: 'main' }]) {
    const f = fixture(options);
    await authorize(f);
    assert.deepEqual(f.calls, ['permission', 'pull']);
    assert.deepEqual(f.outputs, {});
    assert.equal(f.failures.length, 1);
  }
});

test('a comment failure cannot emit authorization outputs', async () => {
  const f = fixture();
  f.github.rest.issues.createComment = async () => { throw new Error('comment failed'); };
  await assert.rejects(authorize(f), /comment failed/);
  assert.deepEqual(f.outputs, {});
});
