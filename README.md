# Intern Developer Plus

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/saccanimattia/sf-academy.git


2. Go to the folder:

    cd sf-academy
   
3. Start the application

   docker-compose up --build

4. use the application

   now yuo can find the application there : http://localhost:5000/
   
### Usage

1. /importDataFromFile
This endpoint allows you to upload text files to the database for processing by the server. Each line in the file is expected to follow the format "P [number] [string]", where [number] is an integer between one and five, and [string] is a message. Lines that do not conform to this format will be disregarded.

2. /data
This endpoint allows you to retrieve data from the database. It supports two optional parameters:

from: Retrieve data from a specific date.
limit: Limit the number of values returned by the database.

3. /pendingData
This endpoint returns data that has not yet been processed by the server.
