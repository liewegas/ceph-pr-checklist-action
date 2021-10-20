const core = require('@actions/core');
const github = require('@actions/github');

try {
  const description = core.getInput('description');
  console.log(`Desc is ${description}!`);
  core.setOutput("errors", null);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
