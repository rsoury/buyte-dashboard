import React from "react";
import { Textarea } from "evergreen-ui";

import InputField from "./InputField";

const TextAreaInputField = props => (
	<InputField {...props}>
		<Textarea />
	</InputField>
);

export default TextAreaInputField;
