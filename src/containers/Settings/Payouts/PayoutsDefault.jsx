import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane, Button, toaster } from "evergreen-ui";
import isEmpty from "is-empty";
import styled from "styled-components";

import { UserProps } from "@/constants/common-prop-types";
import getUserAttr from "@/utils/get-user-attr";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import { Body, LoaderPane } from "@/components/Dashboard";
import PageHeading from "@/components/PageHeading";
import Functions from "@/api/functions";

const PayoutsForm = styled.iframe`
	height: 100%;
	width: 100%;
	border: none;
	border-radius: 4px;
`;

class PayoutsDefault extends Component {
	static propTypes = {
		user: UserProps.isRequired,
		payoutsFormUrl: PropTypes.string,
		load: PropTypes.func.isRequired
	};

	static defaultProps = {
		payoutsFormUrl: ""
	};

	state = {
		isRequestingPayout: false
	};

	async componentDidMount() {
		const { load } = this.props;
		load();
	}

	getAttr = type => {
		const { user } = this.props;
		return getUserAttr(user)(type);
	};

	requestPayout = async () => {
		this.setState({ isRequestingPayout: true });
		await Functions.notify({
			text: "New Payout Request",
			fields: {
				id: this.getAttr(userAttributeTypes.ID),
				email: this.getAttr(userAttributeTypes.EMAIL)
			}
		});
		this.setState({ isRequestingPayout: false });
		toaster.success(`Submitted a request for payout`, {
			description: `You should receive an email regarding the status of your payout in the next 2 business days.`,
			id: "request-payout",
			duration: 7.5
		});
	};

	render() {
		const { isRequestingPayout } = this.state;
		const { payoutsFormUrl } = this.props;

		const isLoading = isEmpty(payoutsFormUrl);

		return (
			<Body
				title="Payout Settings"
				headerActions={() => (
					<Button
						appearance="primary"
						intent="none"
						iconBefore="add"
						isLoading={isRequestingPayout || isLoading}
						height={36}
						onClick={this.requestPayout}
					>
						Request Payout
					</Button>
				)}
			>
				<PageHeading>
					Connect your Bank Account and associated business information to
					receive payouts.
				</PageHeading>
				{isLoading ? (
					<Pane height="100%" width="100%">
						<LoaderPane />
					</Pane>
				) : (
					<Pane paddingY={20} width="100%" height={1000}>
						<PayoutsForm
							title="Payouts Form"
							src={payoutsFormUrl}
							scrolling="no"
						/>
					</Pane>
				)}
			</Body>
		);
	}
}

export default PayoutsDefault;
