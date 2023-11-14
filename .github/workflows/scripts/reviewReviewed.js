const { App } = require('@slack/bolt');
const mongoose = require('mongoose');

// commented, approved, changes_requested

const getUserModel = () => {
  const userSchema = new mongoose.Schema({
    slackId: { type: String, required: true }, // Slack user ID
    slackName: { type: String, required: true }, // Slack user name; do we want to keep track of this
    role: { type: String, required: true }, // "ADMIN" | "TECHLEAD" | "MEMBER" - defined in config/perms.js
    repos: { type: Array, required: true }, // List of assigned projects
    github: { type: String, required: true },
    rep: { type: Number, required: true }, // Reputation count
    matchyEnabled: { type: Boolean, required: true }, // Opted into Matchy or not
  });
  return mongoose.model('User', userSchema);
};

const messageAssignee = async ({ context }) => {
  // Initializes your app with your bot token and signing secret
  const Bot = new App({
    token: process.env.SLACK_TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_LEVEL_TOKEN,
  });

  const reviewer = context.payload.sender.login;
  const githubAssignees = context.payload.pull_request.assignees;
  const url = context.payload.review.html_url;

  // Connect to mongo
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const mongoConnection = mongoose.connection;
  // After connection is established, do the things
  mongoConnection.once('open', async () => {
    try {
      const UserModel = getUserModel();
      const slackAssignees = await Promise.allSettled(
        githubAssignees.map(assignee => UserModel.findOne({ github: assignee.login })),
      );
      if (context.payload.review.state === 'approved') {
        await Promise.all(
          slackAssignees.map(assignee =>
            Bot.client.chat.postMessage({
              channel: assignee.value?.slackId,
              text: `One of your pull requests has been APPROVED by ${reviewer}! <${url}|View Review> :shrek::thumbsup:`,
            }),
          ),
        );
      } else {
        await Promise.all(
          slackAssignees.map(assignee =>
            Bot.client.chat.postMessage({
              channel: assignee.value?.slackId,
              text: `One of your pull requests has been REVIEWED by ${reviewer}! <${url}|View Review> :shrek:`,
            }),
          ),
        );
      }
    } catch (e) {
      console.log(e);
    }
    mongoConnection.close();
  });
};

module.exports = messageAssignee;
