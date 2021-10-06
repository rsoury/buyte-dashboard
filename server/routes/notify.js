const SlackNotify = require("slack-notify");
const isEmpty = require("is-empty");
const { SLACK_WEBHOOK_URL } = require("../constants/env");

const slack = SlackNotify(SLACK_WEBHOOK_URL);

const newNotificaton = () => async (req, res) => {
	if (isEmpty(req.body)) {
		return res.status(400).send("failed");
	}
	await new Promise((resolve, reject) => {
		slack.alert(req.body, err => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
	return res.send("success");
};

module.exports = { newNotificaton };
