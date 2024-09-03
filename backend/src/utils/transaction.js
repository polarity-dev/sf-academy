const axios = require('axios');
const { Command } = require('commander');

const command = new Command();

command
    .argument('<crypto>', 'the crypto involved in the transaction')
    .argument('<action>', 'the required action')
    .argument('[quantity]', 'the crypto quantity', "1")
    .action(async (symbol, action, quantity) => {
        try {
            const response = await axios.post('http://0.0.0.0:3000/api/transactions', {
                symbol: symbol,
                action: action,
                quantity: quantity
            }); 
            console.log(response.data);
        } catch (error) {
            console.error("There was an error with the post request: ", error);
        }
    });

command.parse();
