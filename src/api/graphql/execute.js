import { API, graphqlOperation } from "aws-amplify";

const execute = (value, variables) =>
	API.graphql(graphqlOperation(value, variables));

export default execute;
