import React from "react";
import PropTypes from "prop-types";
import { Pane, Text, Icon } from "evergreen-ui";

import * as colors from "@/constants/colors";

const StepsProgress = ({ step, steps }) => (
	<Pane
		marginBottom={10}
		display="flex"
		alignItems="center"
		justifyContent="space-between"
	>
		{steps.map((stepName, index) => {
			let iconColor = "disabled";
			if (step === index) {
				iconColor = colors.SECONDARY_LIGHT;
			}
			if (step > index) {
				iconColor = colors.PRIMARY_DARK;
			}

			return (
				<Pane
					key={stepName}
					width="100%"
					marginX={5}
					textAlign="center"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Icon icon="tick-circle" color={iconColor} marginRight={10} />
					<Text fontWeight={900}>{stepName}</Text>
				</Pane>
			);
		})}
	</Pane>
);

StepsProgress.propTypes = {
	step: PropTypes.number,
	steps: PropTypes.arrayOf(PropTypes.string).isRequired
};

StepsProgress.defaultProps = {
	step: 0
};

export default StepsProgress;
