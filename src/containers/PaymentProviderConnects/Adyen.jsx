/* eslint-disable no-unused-vars, no-console */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Pane,
	Strong,
	Switch,
	Text,
	UnorderedList,
	ListItem,
	Button,
	toaster,
	Link,
	Paragraph
} from "evergreen-ui";
import adyenEncrypt from "adyen-cse-web";

import Functions from "@/api/functions";
import { noHighlight } from "@/styles/global.module.css";
import TextInputField from "@/components/TextInputField";

const exampleCardData = {
	number: "4293 1891 0000 0008",
	expiryMonth: "8",
	expiryYear: "2069",
	cvc: "121",
	holderName: "Ryan Soury"
};

class AdyenConnect extends Component {
	static propTypes = {
		isTest: PropTypes.bool,
		merchantAccount: PropTypes.string,
		username: PropTypes.string,
		password: PropTypes.string,
		csePublicKey: PropTypes.string,
		liveUrlPrefix: PropTypes.string,
		onConnect: PropTypes.func,
		onConnectFailure: PropTypes.func
	};

	static defaultProps = {
		isTest: false,
		merchantAccount: "",
		username: "",
		password: "",
		csePublicKey: "",
		liveUrlPrefix: "",
		onConnect: () => {},
		onConnectFailure: () => {}
	};

	constructor(props) {
		super(props);

		const {
			isTest,
			merchantAccount,
			username,
			password,
			csePublicKey,
			liveUrlPrefix
		} = props;

		this.state = {
			isTest,
			merchantAccount,
			username,
			password,
			liveUrlPrefix,
			csePublicKey,
			isConnecting: false,
			errors: [
				// { id: text input id, message: some error message }
			]
		};
	}

	testSwitchChange = e => {
		this.setState({ isTest: e.target.checked });
	};

	onTextInputChange = e => {
		// The id of the text input should correlate to the state property
		const stateName = e.target.id;

		// Check to see if an error for the text input exists, and remove it.
		const errors = this.removeInputError(stateName, true);

		this.setState({ [stateName]: e.target.value, errors });
	};

	removeInputError = (id, isReturningValue = false) => {
		let { errors } = this.state;
		errors = errors.filter(({ id: errorId }) => errorId !== id);

		if (isReturningValue) {
			return errors;
		}

		return this.setState({ errors });
	};

	inputError = (id, message, isToasting = false) => {
		const errors = this.removeInputError(id, true);
		errors.push({
			id,
			message
		});

		if (isToasting) {
			toaster.danger(message, {
				id,
				duration: 7.5
			});
		}

		// Return, so that the rest of the code in this function isn't executed.
		return this.setState({ errors });
	};

	connect = async () => {
		const { onConnect, onConnectFailure } = this.props;
		const {
			isTest,
			merchantAccount,
			username,
			password,
			liveUrlPrefix,
			csePublicKey
		} = this.state;
		this.setState({ isConnecting: true });

		// Get server-based time as Adyen's GenerationTime
		// --- I think Adyen needs this for a security check. Does the time match the origin location time.
		const { generationTime } = await Functions.getAdyenGenTime();

		let adyenEncryptedData;
		try {
			// Encrypt the fake card. Wrap in Try/Catch because it throws breaking error.
			const cseInstance = adyenEncrypt.createEncryption(csePublicKey, {
				enableValidations: false
			});
			adyenEncryptedData = cseInstance.encrypt({
				generationtime: generationTime,
				...exampleCardData
			});
		} catch (e) {
			this.inputError(
				"csePublicKey",
				"Your CSE Public Key is invalid and could not encrypt our test card. Please refer back to you Adyen Dashboard and provide a valid key.",
				true
			);
			this.setState({ isConnecting: false });
			return;
		}

		try {
			const credentials = {
				isTest,
				merchantAccount,
				username,
				password,
				liveUrlPrefix,
				csePublicKey
			};
			// Trigger an API Request to a Adyen Ping Function. This function uses the parameters sent to Ping Adyen Servers and get a response.
			const result = await Functions.connectToAdyen({
				...credentials,
				adyenEncryptedData
			});

			// console.log(result);

			this.setState({ isConnecting: false });
			onConnect(credentials);
		} catch (e) {
			console.error(e);
			this.setState({ isConnecting: false });
			onConnectFailure();
		}
	};

	validate = () => {
		const {
			isConnecting: _,
			isTest,
			liveUrlPrefix,
			...restOfInputs
		} = this.state;
		let allValuesValid = true;
		// Check text inputs have values.
		Object.entries(restOfInputs).forEach(([key, val]) => {
			if (!val) {
				allValuesValid = false;
			}
		});
		// Check if liveUrlPrefix has a value only if isTest is false.
		if (!isTest && !liveUrlPrefix) {
			allValuesValid = false;
		}
		// Disable buttons if all values are not valid.
		return allValuesValid;
	};

	render() {
		// The Id of each input must be the StateName.
		const {
			isTest,
			merchantAccount,
			username,
			password,
			csePublicKey,
			liveUrlPrefix,
			isConnecting,
			errors
		} = this.state;

		const textInputs = [
			{
				id: "merchantAccount",
				value: merchantAccount,
				title: "Merchant Account Code",
				Description: () => (
					<Paragraph>
						Unique to your Adyen account, this code is displayed at the top of
						the Adyen dashboard (make sure this is an active Account Code in
						Adyen)
					</Paragraph>
				),
				placeholder: "BuyteDemoCode"
			},
			{
				id: "username",
				value: username,
				title: "Web Service Username",
				Description: () => (
					<>
						<Paragraph>
							Ensure that your Web Service User has the following roles enabled
						</Paragraph>
						<UnorderedList>
							<ListItem>API Clientside Encryption Payments role</ListItem>
							<ListItem>
								<Paragraph>API Supply MPI data with Payments</Paragraph>
								<Paragraph size={300}>
									This must be requested from Adyen Support directly.
								</Paragraph>
							</ListItem>
							<ListItem>Checkout webservice role</ListItem>
							<ListItem>Merchant PAL Webservice role</ListItem>
						</UnorderedList>
					</>
				),
				placeholder: "ws_123456@Company.Buyte",
				isFullWidth: true
			},
			{
				id: "password",
				value: password,
				title: "Web Service Password",
				placeholder: "YI1jRE<gjZG1#5~u#en[3+PGN",
				isFullWidth: true,
				isPassword: true
			},
			{
				id: "csePublicKey",
				value: csePublicKey,
				title: "Client Encryption Public Key",
				Description: () => (
					<>
						<Paragraph>
							You can find your CSE Public Key alongside your API Key under
							Client-Side Encryption.
						</Paragraph>
					</>
				),
				placeholder: "Client Encryption Public Key",
				isFullWidth: true
			}
		].concat(
			!isTest
				? [
						{
							id: "liveUrlPrefix",
							value: liveUrlPrefix,
							title: "Live URL Prefix",
							Description: () => (
								<>
									<Paragraph>
										Information on how to attain your Live URL Prefix can be
										found here:
									</Paragraph>
									<Paragraph>
										<Link
											href="https://docs.adyen.com/developers/development-resources/live-endpoints"
											target="_blank"
											rel="noopener noreferrer"
										>
											https://docs.adyen.com/developers/development-resources/live-endpoints
										</Link>
									</Paragraph>
									<br />
									<Paragraph fontStyle="italic">
										Only include the Prefix, not the entire URL.
									</Paragraph>
								</>
							),
							placeholder: "17j3kdoffbb37ca7-AdyenBuyteDemo"
						}
				  ]
				: []
		);

		return (
			<Pane>
				<Pane>
					<Pane display="inline-flex" paddingBottom={40} alignItems="center">
						<Switch
							id="isTest"
							marginRight={14}
							height={28}
							checked={isTest}
							onChange={this.testSwitchChange}
						/>
						<Strong
							is="label"
							htmlFor="isTest"
							cursor="pointer"
							className={noHighlight}
						>
							Connect{" "}
							<Text textDecoration="underline" fontWeight={900}>
								Test
							</Text>{" "}
							Adyen Account?
						</Strong>
					</Pane>
				</Pane>

				{textInputs.map(fieldProps => {
					// Does the text input array exist with the errors array.
					const error =
						errors.find(({ id: errorId }) => errorId === fieldProps.id) || {};

					return (
						<TextInputField
							key={fieldProps.id}
							paddingBottom={40}
							{...fieldProps}
							error={error.message}
							onChange={this.onTextInputChange}
						/>
					);
				})}

				<Pane paddingBottom={40}>
					<Button
						height={48}
						appearance="primary"
						intent="none"
						disabled={!this.validate()}
						isLoading={isConnecting}
						onClick={this.connect}
					>
						Connect with Ayden
					</Button>
				</Pane>
			</Pane>
		);
	}
}

export default AdyenConnect;
