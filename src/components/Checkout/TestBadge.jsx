import React from "react";
import PropTypes from "prop-types";
import { Strong } from "evergreen-ui";

import { noHighlight } from "@/styles/global.module.css";
import * as colors from "@/constants/colors";

const Badge = ({ isLarge }) => {
	const conditionalProps = isLarge
		? {
				marginRight: 10
		  }
		: {
				marginRight: 5
		  };
	return (
		<Strong
			textTransform="uppercase"
			size={300}
			letterSpacing={1}
			fontWeight={900}
			color="#fff"
			paddingTop={2.5}
			padding={5}
			backgroundColor={colors.SECONDARY}
			borderRadius={4}
			className={noHighlight}
			{...conditionalProps}
		>
			TEST
		</Strong>
	);
};

Badge.propTypes = {
	isLarge: PropTypes.bool
};

Badge.defaultProps = {
	isLarge: false
};

export default Badge;
