// schema for the information required for a transactions
const transactionSchema = {
    type: 'object',
    required: ['action','symbol'],
    properties: {
        action: { type: 'string' },
        symbol: { type: 'string' },
        quantity: { type: 'number' }
    }
};

export default transactionSchema;