/* eslint-disable react/no-unused-state */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Pane,
	Button,
	Paragraph,
	Strong,
	Heading,
	Card,
	toaster
} from "evergreen-ui";
import CopyToClipboard from "react-copy-to-clipboard";
import isEmpty from "is-empty";

import TextInputField from "@/components/TextInputField";
import { UserProps } from "@/constants/common-prop-types";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";
import { Body } from "@/components/Dashboard";

class Developers extends Component {
	static propTypes = {
		apiKeys: PropTypes.shape({
			public: PropTypes.string,
			secret: PropTypes.string
		}),
		user: UserProps.isRequired,
		loadSecretKey: PropTypes.func.isRequired,
		loadPublicKey: PropTypes.func.isRequired
	};

	static defaultProps = {
		apiKeys: {
			public: "",
			secret: ""
		}
	};

	fields = [
		{
			id: "publicKey",
			title: "Public Key",
			Description: () => (
				<Paragraph>
					Used with Widget ID to display Checkout Widget on the browser.
				</Paragraph>
			),
			isFullWidth: true,
			isEditable: false
		},
		{
			id: "secretKey",
			title: "Secret Key",
			Description: () => (
				<Paragraph>
					Used to create API requests.{" "}
					<Strong>Please do not share this secret key.</Strong>
				</Paragraph>
			),
			value: "sk_RBVdEBZ2EIJySoF3RX00ELWmQBJ5DoRyTIZbRLDdRIGrTIF2QsAD",
			isFullWidth: true,
			isEditable: false
		}
	];

	constructor(props) {
		super(props);

		this.state = {
			publicKey: props.apiKeys.public,
			secretKey: props.apiKeys.secret,
			isPublicKeyLoading: false,
			isSecretKeyLoading: false
		};
	}

	componentDidMount() {
		this.loadPublicKey();
	}

	static getDerivedStateFromProps(nextProps, { publicKey, secretKey }) {
		if (!isEmpty(nextProps.apiKeys.public) && isEmpty(publicKey)) {
			return {
				publicKey: nextProps.apiKeys.public,
				isPublicKeyLoading: false
			};
		}
		if (!isEmpty(nextProps.apiKeys.secret) && isEmpty(secretKey)) {
			return {
				secretKey: nextProps.apiKeys.secret,
				isSecretKeyLoading: false
			};
		}

		return null;
	}

	onCopy = (value, { id, title }) => {
		if (value) {
			toaster.success(`${title} copied to Clipboard`, {
				id: `${id}-copy`
			});
			track(eventTypes.COPY_API_KEY, { id, title });
		}
	};

	loadPublicKey = () => {
		const { publicKey } = this.state;
		if (isEmpty(publicKey)) {
			const { loadPublicKey } = this.props;
			this.setState({ isPublicKeyLoading: true });
			loadPublicKey();
		}
	};

	loadSecretKey = async () => {
		const { secretKey } = this.state;
		if (isEmpty(secretKey)) {
			const { loadSecretKey } = this.props;
			this.setState({ isSecretKeyLoading: true });
			loadSecretKey();
		}
	};

	getValueFromState = id => {
		const { [id]: valueFromState } = this.state;
		return valueFromState;
	};

	render() {
		const { isSecretKeyLoading, isPublicKeyLoading } = this.state;

		return (
			<Body title="Developers">
				<Pane
					display="flex"
					flex={1}
					flexDirection="column"
					textAlign="left"
					alignItems="flex-start"
					justifyContent="flex-start"
					height="auto"
				>
					<Heading size={700} marginBottom={20}>
						API Keys
					</Heading>
					<Paragraph>
						Copy these keys into your eCommerce platform or into your Widget
						integration. <br />
						Documenation on the Buyte API and Buyte widget are coming soon. In
						the mean time, please request assistance from Buyte Support.
					</Paragraph>
					{this.fields.map(field => {
						const value = this.getValueFromState(field.id);
						const isSecretKey = field.id === "secretKey";
						return (
							<Card
								key={field.id}
								marginY={20}
								marginX="0"
								padding={20}
								elevation={0}
								width="100%"
								display="block"
								borderTop
								borderBottom
								borderLeft
								borderRight
							>
								<TextInputField
									{...field}
									value={value || field.value || ""}
									isPassword={isSecretKey && !value} // isPassword if is secret and empty value.
								/>
								<Pane marginTop={20}>
									{isSecretKey && (
										<Button
											height={34}
											appearance="primary"
											intent="none"
											iconBefore="clipboard"
											marginRight={12}
											isLoading={isSecretKeyLoading}
											disabled={!!value}
											onClick={this.loadSecretKey}
										>
											Reveal Secret Key
										</Button>
									)}
									<CopyToClipboard
										text={value}
										onCopy={() => this.onCopy(value, field)}
									>
										<Button
											height={34}
											intent="none"
											iconBefore="clipboard"
											disabled={!value}
											isLoading={
												!isSecretKey && isPublicKeyLoading // Loading if not secret key, and is public key loading.
											}
										>
											Copy
										</Button>
									</CopyToClipboard>
								</Pane>
							</Card>
						);
					})}
				</Pane>
			</Body>
		);
	}
}

export default Developers;
