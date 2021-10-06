import React from "react";

import InputField from "./InputField";
import PhoneInput from "./PhoneInput";

// Props automatically provided to children.

const PhoneInputField = ({ ...props }) => {
	return (
		<InputField {...props}>
			<PhoneInput height={40} />
		</InputField>
	);
};

export default PhoneInputField;
