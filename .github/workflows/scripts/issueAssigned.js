const { App } = require('@slack/bolt');
const mongoose = require('mongoose');

const getUserModel = () => {
  const userSchema = new mongoose.Schema({
    slackId: { type: String, required: true }, // Slack user ID
    slackName: { type: String, required: true }, // Slack user name
    role: { type: String, required: true }, // "ADMIN" | "TECHLEAD" | "MEMBER"
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

  const assignee = context.payload.assignee.login;
  const url = context.payload.issue.html_url;

  // Connect to mongo
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const mongoConnection = mongoose.connection;
  // After connection is established, DM assignee on Slack
  mongoConnection.once('open', async () => {
    try {
      const UserModel = getUserModel();
      const user = await UserModel.findOne({ github: assignee });
      await Bot.client.chat.postMessage({
        channel: user.slackId,
        text: `You have been assigned to an <${url}|issue> for \`${context.payload.repository.name}\`! :worry-frog-cheer:`,
      });
    } catch (e) {
      console.log(e);
    }
    mongoConnection.close();
  });
};

module.exports = messageAssignee;
