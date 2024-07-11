### Install
After cloning the repository, install the required dependencies using `npm install` from the project root.

### Run
You can start both the frontend and the backend by simply running `npm run start` from the project root.

Docker and docker compose are required to run both of them.

The frontend will be running on port 8080 whereas the backend will be running on port 8000.


### Generate sample data
You can generate sample data to feed to the application, by running `npm run generate`.
Two command line arguments can be provided (in the following order):
- An optional number `N` which controls how many lines are generated
- An optional path used to save the output file. The default output is inside the `data` folder. You need to provide a value for `N` if you want to pass this argument 
