const AWS = require("aws-sdk");

const PUBLIC_KEY_USER_ATTRIBUTE_NAME = "custom:public_key_id";
const SECRET_KEY_USER_ATTRIBUTE_NAME = "custom:secret_key_id";

const getApiKey = (
	{ username: Username, userPoolId: UserPoolId },
	userAttributeName
) => {
	const cognitoISP = new AWS.CognitoIdentityServiceProvider({
		apiVersion: "2016-04-18"
	});
	const apigateway = new AWS.APIGateway({ apiVersion: "2015-07-09" });

	return new Promise((resolve, reject) => {
		cognitoISP.adminGetUser(
			{
				Username,
				UserPoolId
			},
			(err, data) => {
				if (err) {
					reject(err);
				} else {
					const { Value: id } =
						data.UserAttributes.find(
							({ Name }) => Name === userAttributeName
						) || {};

					if (id) {
						apigateway.getApiKey(
							{
								apiKey: id,
								includeValue: true
							},
							(agErr, agData) => {
								if (err) {
									reject(agErr);
								} else {
									const { value } = agData;
									resolve(value);
								}
							}
						);
					} else {
						console.log(data);
						const e = new Error("Cannot find Key Id from User Attributes");
						console.log(e);
						reject(e);
					}
				}
			}
		);
	});
};

const routeHandler = userAttributeName => async (req, res, next) => {
	const { username, userPoolId } = req.query;
	try {
		// Get public key
		const key = await getApiKey({ username, userPoolId }, userAttributeName);
		return res.status(200).send({ key });
	} catch (e) {
		return next(e);
	}
};

module.exports = {
	public: () => routeHandler(PUBLIC_KEY_USER_ATTRIBUTE_NAME),
	secret: () => routeHandler(SECRET_KEY_USER_ATTRIBUTE_NAME)
};
