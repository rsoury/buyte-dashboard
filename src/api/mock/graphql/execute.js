/* eslint-disable no-console */

/*
    TESTING GRAPHQL EXECUTION
    This file overrides the Execute function in execute.js

    This is i think failure so far.... attempting to Mock AWS APPSync is a nightmare.
	TODO: We need to create means of adding version control and testing to our store
	-- By Mocking the store entirely
	-- Or replicating it
*/

import { graphql } from "graphql";
import GraphQLJSON from "graphql-type-json";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

const schemaData = `
scalar AWSJSON
directive @aws_subscribe(mutations: [String]) on FIELD_DEFINITION

${process.env.TEST_GRAPHQL_SCHEMA}`;

// Better mock for aws_subscribe...
const directiveResolvers = {
	// aws_subscribe(next, src, args, context) {
	aws_subscribe(next) {
		return next().then(() => null);
	}
};

const schema = makeExecutableSchema({
	typeDefs: schemaData,
	resolvers: {
		AWSJSON: GraphQLJSON
	},
	directiveResolvers
});
addMockFunctionsToSchema({ schema });

const execute = async (value, variables) => {
	const { errors, data } = await graphql(schema, value, null, null, variables);
	console.log(errors);
	return data;
};

export default execute;
