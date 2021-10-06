import React from "react";
import { Redirect } from "react-router-dom";

import * as routes from "@/constants/routes";

const Settings = props => <Redirect to={routes.SETTINGS_ACCOUNT} {...props} />;

export default Settings;
