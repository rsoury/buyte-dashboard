import React from "react";
import PropTypes from "prop-types";
import { Code, Icon, Tooltip } from "evergreen-ui";
import CopyToClipboard from "react-copy-to-clipboard";

import * as colors from "@/constants/colors";

const CopyableCode = ({ children, onCopy }) => {
	let text = "";
	React.Children.forEach(children, child => {
		if (typeof child === "string") {
			text += child;
		}
	});

	return (
		<>
			<Code>{children}</Code>
			<CopyToClipboard text={text} onCopy={onCopy}>
				<Tooltip content="Copy">
					<Icon icon="clipboard" color={colors.SECONDARY} />
				</Tooltip>
			</CopyToClipboard>
		</>
	);
};

CopyableCode.propTypes = {
	onCopy: PropTypes.func,
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};

CopyableCode.defaultProps = {
	onCopy: () => {},
	children: undefined
};

export default CopyableCode;
