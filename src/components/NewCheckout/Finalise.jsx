import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane, Card, Heading, Paragraph } from "evergreen-ui";

import TextInputField from "@/components/TextInputField";
import TextAreaInputField from "@/components/TextAreaInputField";

class Finalise extends Component {
	static propTypes = {
		onChange: PropTypes.func
	};

	static defaultProps = {
		onChange: () => {}
	};

	state = {
		label: "",
		description: ""
	};

	onInput = e => {
		const { onChange } = this.props;
		const { id, value } = e.target;
		onChange(id, value);
		this.setState({ [id]: value });
	};

	render() {
		const { label, description } = this.state;

		const inputs = [
			{
				id: "label",
				title: "Title",
				Description: () => <Paragraph>Give your checkout a title</Paragraph>,
				onChange: this.onInput,
				value: label,
				isFullWidth: true
			},
			{
				id: "description",
				title: "Description",
				Description: () => (
					<Paragraph>
						What is your checkout used for? Where is it used?
					</Paragraph>
				),
				onChange: this.onInput,
				value: description,
				isFullWidth: true,
				isTextArea: true
			}
		];

		return (
			<Pane
				display="flex"
				width="100%"
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
				minHeight={400}
				paddingY={40}
			>
				<Heading size={700} marginBottom={20} textAlign="center">
					Give your Express Checkout Widget some context
				</Heading>
				{inputs.map(({ isTextArea, ...input }) => (
					<Card
						key={input.id}
						marginBottom={20}
						width="100%"
						maxWidth={600}
						marginX="auto"
						padding={20}
						elevation={0}
					>
						{isTextArea ? (
							<TextAreaInputField {...input} />
						) : (
							<TextInputField {...input} />
						)}
					</Card>
				))}
			</Pane>
		);
	}
}

export default Finalise;
