import _get from "lodash.get";
import { connect } from "react-redux";

import Plugins from "./Plugins";

export default connect(function mapStateToProps({ user }) {
	return {
		email: _get(user, "attributes.email", "")
	};
})(Plugins);
