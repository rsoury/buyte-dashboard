import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane, Switch, Strong, Text, Image } from "evergreen-ui";
import AcrossTabs from "across-tabs";
import camelCase from "lodash.camelcase";

import Functions from "@/api/functions";
import { noHighlight } from "@/styles/global.module.css";
import { handleException } from "@/utils/tracking";
import StripeConnectButton from "@/assets/providers/stripe/blue-on-light/blue-on-light@2x.png";

class StripeConnect extends Component {
	static propTypes = {
		onConnect: PropTypes.func,
		onConnectFailure: PropTypes.func,
		isTest: PropTypes.bool
	};

	static defaultProps = {
		onConnect: () => {},
		onConnectFailure: () => {},
		isTest: false
	};

	constructor(props) {
		super(props);

		const { isTest } = this.props;

		this.state = {
			isTest
		};

		this.TabOpener = null;
	}

	componentDidMount() {
		const { onConnect, onConnectFailure } = this.props;
		const onChildCommunication = (payload = {}) => {
			const { id, data: unsanitisedData, connected } = payload;
			let data = unsanitisedData.split("&#34;").join('"');
			try {
				data = JSON.parse(data);
			} catch (e) {
				handleException(
					e,
					{ credentials: data },
					"Cannot parse credentials to json"
				);
			}
			this.TabOpener.closeTab(id);

			setTimeout(() => {
				if (connected) {
					// replace "livemode" with "isTest"
					const { livemode, ...connectData } = data;
					const formattedConnectData = {};
					Object.entries(connectData).forEach(([key, value]) => {
						formattedConnectData[camelCase(key)] = value;
					});
					onConnect({
						isTest: !livemode,
						...formattedConnectData
					});
				} else {
					onConnectFailure();
				}
			}, 500);
		};
		this.TabOpener = new AcrossTabs.Parent({
			removeClosedTabs: true,
			onChildCommunication
		});
	}

	testSwitchChange = e => {
		this.setState({ isTest: e.target.checked });
	};

	stripeOAuth = () => {
		const { isTest } = this.state;
		const connectUrl = Functions.getStripeStandardConnectUrl(isTest);

		this.TabOpener.openNewTab({ url: connectUrl, name: "StripeConnect" });
	};

	render() {
		const { isTest } = this.state;
		const imageAlt = `${isTest ? "Test" : ""} Connect with Stripe`;
		const switchId = "stripe-use-test";

		return (
			<Pane>
				<Pane>
					<Pane display="inline-flex" paddingBottom={20} alignItems="center">
						<Switch
							id={switchId}
							marginRight={14}
							height={28}
							checked={isTest}
							onChange={this.testSwitchChange}
						/>
						<Strong
							is="label"
							htmlFor={switchId}
							cursor="pointer"
							className={noHighlight}
						>
							Connect{" "}
							<Text textDecoration="underline" fontWeight={900}>
								Test
							</Text>{" "}
							Stripe Account?
						</Strong>
					</Pane>
				</Pane>
				<Pane>
					<Pane
						display="inline-block"
						borderRadius={6}
						hoverElevation={3}
						activeElevation={0}
						overflow="hidden"
						height="42px"
						cursor="pointer"
						onClick={this.stripeOAuth}
					>
						<Image
							src={StripeConnectButton}
							alt={imageAlt}
							title={imageAlt}
							width={250}
							display="block"
							padding={0}
							margin={0}
						/>
					</Pane>
				</Pane>
			</Pane>
		);
	}
}

export default StripeConnect;
