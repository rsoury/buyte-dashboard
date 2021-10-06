import React from "react";
import PropTypes from "prop-types";
import { Pane, Button } from "evergreen-ui";

const StepButtons = ({
	step,
	onBack,
	onNext,
	backButtonProps,
	nextButtonProps,
	backText,
	nextText
}) => {
	return (
		<Pane
			position="absolute"
			left={0}
			bottom={0}
			right={0}
			zIndex={100}
			padding={10}
			backgroundColor="#fff"
			borderTop="1px solid rgb(240, 240, 240)"
			display="flex"
			alignItems="center"
			justifyContent="space-between"
		>
			{step > 0 && (
				<Button
					appearance="minimal"
					iconBefore="arrow-left"
					height={42}
					onClick={onBack}
					{...backButtonProps}
				>
					{backText}
				</Button>
			)}
			<Button
				appearance="primary"
				iconAfter="arrow-right"
				onClick={onNext}
				marginLeft="auto"
				height={42}
				{...nextButtonProps}
			>
				{nextText}
			</Button>
		</Pane>
	);
};

StepButtons.propTypes = {
	step: PropTypes.number,
	onBack: PropTypes.func,
	onNext: PropTypes.func,
	backButtonProps: PropTypes.object,
	nextButtonProps: PropTypes.object,
	backText: PropTypes.string,
	nextText: PropTypes.string
};

StepButtons.defaultProps = {
	step: 0,
	onBack() {},
	onNext() {},
	backButtonProps: {},
	nextButtonProps: {},
	backText: "",
	nextText: ""
};

export default StepButtons;
