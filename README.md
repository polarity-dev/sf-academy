Intern Developer Task

### Install and Run

After cloning the repository, run `docker compose up --build` and the application will start. 

### Web dashboard

You can access the dashboard web on http://0.0.0.0:3000/.

### transaction.js utility file

The transactions.js file is located under the backend/src/utils folder. Its usage is described in the intern-developer.md file. 

### JSON endpoints tests

To test JSON endpoints after having started the application, run `curl http://0.0.0.0:3000/api/crypto` to get the crypto list or `curl http://0.0.0.0:3000/api/transactions` to get the transaction list. 
To make a transaction through the command line, run `curl -X POST -d "symbol=the crypto you want to buy" -d "action=(buy or sell)" -d "quantity=how much crypto you are managing" http://0.0.0.0:3000/api/transactions`. The `quantity` property is optional and defaults to 1.  

### Playing with the project

If you want to modify the project default parameters, such as the starting budget or the delay between price modifications, you can do so by either modifying the .env file or the database/init.sql file. 
After doing so, run `docker compose down` in order to drop the database and run `docker compose up --build` again in order to build the database with the updated data. 

### Project possible improvements

-- Add retry logic for database query fails. 