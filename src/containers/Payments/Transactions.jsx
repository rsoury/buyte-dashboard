import React from "react";
import PropTypes from "prop-types";
import {
	Pane,
	Card,
	Spinner,
	Heading,
	Paragraph,
	Icon,
	Table,
	Text,
	Tooltip,
	Position,
	Image
} from "evergreen-ui";
import isEmpty from "is-empty";
import _startCase from "lodash.startcase";

import { AccountTransactionsProps } from "@/constants/common-prop-types";
import Currency from "@/components/Currency";

const Transactions = ({ isLoading, transactions }) => {
	const getTypeIconProps = type => {
		switch (type.toLowerCase()) {
			case "payout": {
				return {
					icon: "dollar",
					color: "info"
				};
			}
			case "payment": {
				return {
					icon: "caret-up",
					color: "success"
				};
			}
			case "refund": {
				return {
					icon: "caret-down",
					color: "danger"
				};
			}
			case "charge": {
				return {
					icon: "credit-card",
					color: "success"
				};
			}
			default: {
				return null;
			}
		}
	};

	return (
		<Pane>
			<Heading
				fontWeight={900}
				size={400}
				opacity="0.5"
				textTransform="uppercase"
				letterSpacing={1}
				marginBottom={10}
			>
				Recent Transactions
			</Heading>
			{isLoading ? (
				<Pane
					paddingX={20}
					paddingY={50}
					textAlign="center"
					width="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Spinner size={26} />
				</Pane>
			) : (
				<Pane>
					{isEmpty(transactions) ? (
						<Pane textAlign="center" paddingX={20} paddingY={50}>
							<Paragraph>
								<Icon
									icon="double-caret-vertical"
									opacity="0.5"
									marginBottom={10}
									size={30}
								/>
							</Paragraph>
							<Paragraph>No transactions have been made.</Paragraph>
						</Pane>
					) : (
						<Card elevation={0} borderLeft borderTop borderRight borderBottom>
							<Table>
								<Table.Head>
									<Table.TextHeaderCell
										flexBasis={60}
										flexShrink={0}
										flexGrow={0}
									>
										Type
									</Table.TextHeaderCell>
									<Table.TextHeaderCell></Table.TextHeaderCell>
									<Table.TextHeaderCell textAlign="right">
										Net
									</Table.TextHeaderCell>
									<Table.TextHeaderCell textAlign="right">
										Amount
									</Table.TextHeaderCell>
									<Table.TextHeaderCell textAlign="right">
										Fee
									</Table.TextHeaderCell>
									<Table.TextHeaderCell></Table.TextHeaderCell>
									<Table.TextHeaderCell
										flexBasis="40%"
										flexShrink={0}
										flexGrow={0}
									>
										Description
									</Table.TextHeaderCell>
									<Table.TextHeaderCell
										flexBasis={120}
										flexShrink={0}
										flexGrow={0}
										textAlign="right"
									>
										Date Created
									</Table.TextHeaderCell>
								</Table.Head>
								<Table.Body>
									{transactions.map(
										({
											id,
											amount,
											timestamp,
											currency,
											type,
											net,
											fee,
											description,
											method
										}) => {
											// Time
											const ts = new Date(timestamp); // multiple by 1000 to read as milliseconds
											const dateCreated = ts.toLocaleDateString();
											// Type
											const iconProps = getTypeIconProps(type);
											const typeName = _startCase(type);
											return (
												<Table.Row key={id}>
													<Table.TextCell
														flexBasis={60}
														flexShrink={0}
														flexGrow={0}
													>
														{isEmpty(iconProps) ? (
															<Text>{typeName}</Text>
														) : (
															<Tooltip content={typeName}>
																<Icon {...iconProps} />
															</Tooltip>
														)}
													</Table.TextCell>
													<Table.TextCell>
														<Tooltip content={method.name}>
															<Image
																margin={2}
																marginBottom={0}
																src={method.image}
																alt={method.name}
																title={method.name}
																width={40}
															/>
														</Tooltip>
													</Table.TextCell>
													<Table.TextCell textAlign="right">
														<Currency value={net} currency={currency} />
													</Table.TextCell>
													<Table.TextCell textAlign="right">
														<Currency value={amount} currency={currency} />
													</Table.TextCell>
													<Table.TextCell textAlign="right">
														<Currency value={fee} currency={currency} />
													</Table.TextCell>
													<Table.TextCell>
														{currency.toUpperCase()}
													</Table.TextCell>
													<Table.TextCell
														flexBasis="40%"
														flexShrink={0}
														flexGrow={0}
													>
														{description && (
															<Tooltip
																content={description}
																position={Position.BOTTOM_LEFT}
															>
																<Text>{description}</Text>
															</Tooltip>
														)}
													</Table.TextCell>
													<Table.TextCell
														flexBasis={120}
														flexShrink={0}
														flexGrow={0}
														textAlign="right"
													>
														{dateCreated}
													</Table.TextCell>
												</Table.Row>
											);
										}
									)}
								</Table.Body>
							</Table>
						</Card>
					)}
				</Pane>
			)}
		</Pane>
	);
};

Transactions.propTypes = {
	isLoading: PropTypes.bool,
	transactions: AccountTransactionsProps
};

Transactions.defaultProps = {
	isLoading: false,
	transactions: []
};

export default Transactions;
