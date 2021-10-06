import React from "react";
import PropTypes from "prop-types";
import { Card, Pane, Icon, Image, Text } from "evergreen-ui";

import { noHighlight } from "@/styles/global.module.css";
import * as colors from "@/constants/colors";

const Selectable = ({ isSelected, isAvailable, name, image, onClick }) => {
	const availabilityProps = isAvailable
		? {
				onClick
		  }
		: {
				onClick: () => {},
				pointerEvents: "none",
				opacity: 0.2
		  };
	return (
		<Card
			elevation={isSelected ? 3 : 0}
			hoverElevation={isSelected ? 4 : 1}
			margin={5}
			display="inline-flex"
			alignItems="center"
			justifyContent="center"
			width={175}
			height={175}
			cursor="pointer"
			position="relative"
			borderWidth={3}
			borderColor={isSelected ? colors.PRIMARY_DARK : colors.BLACK}
			borderTop
			borderBottom
			borderLeft
			borderRight
			{...availabilityProps}
		>
			{isSelected && (
				<Pane position="absolute" right={-10} top={-10}>
					<Icon
						icon="tick-circle"
						color={colors.PRIMARY_DARK}
						size={25}
						borderRadius="100%"
						backgroundColor="#ffffff"
						border="3px solid #fff"
					/>
				</Pane>
			)}
			<Pane textAlign="center">
				<Image
					src={image}
					alt={name}
					title={name}
					marginBottom={10}
					width="100%"
					maxWidth={100}
					maxHeight={100}
					className={noHighlight}
				/>
				<Pane>
					<Text fontWeight={900} className={noHighlight}>
						{name}
					</Text>
				</Pane>
			</Pane>
		</Card>
	);
};

Selectable.propTypes = {
	isSelected: PropTypes.bool,
	isAvailable: PropTypes.bool,
	name: PropTypes.string,
	image: PropTypes.string,
	onClick: PropTypes.func
};

Selectable.defaultProps = {
	isSelected: false,
	isAvailable: true,
	name: "",
	image: "",
	onClick: () => {}
};

export default Selectable;
