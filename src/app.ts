import fs from "fs";
import express from "express";
import path from "path";
import multer from "multer";
import mySql2 from "mysql2";

// Specifiche per utilizzo del middleware multer per salvare i file importati
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/'); // Salve il file in "uploads"
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });

const app: any = express();
const port: number = 49160;

const pagesDirectory = path.resolve(process.cwd(), "./");
app.use("/css", express.static("css"));

// GET request per il file principale HTML
app.get("/", (request: any, response: any) => {
	sendPage(response, "text/html", 200, "pages/index.html");
});

// GET request per ilCSS del file principale
app.get("style.css", (request: any, response: any) => {
	sendPage(response, "text/css", 200, "css/style.css");
});

// POST request per gestire l'endpoint /importDataFromFile
app.post("/importDataFromFile", upload.single("fileInput"), async (request: any, response: any) => {
	fs.readFile("utility/dataToProcess.json", "utf-8", (error, JSONdata) => {
		if (error) {
			console.log(error);
			// throw error;
			return;
		}

		try {
			// Filtraggio dati in input
			fs.readFile(request.file.path, "utf-8", (error, data) => {
				if (error) {
					console.log(error);
					// throw error;
					return;
				}

				let myData: any = data.split("\n");
				let A: number = parseInt(myData[0].split(" ")[0]);
				let B: number = parseInt(myData[0].split(" ")[1]);

				let filteredData = myData.filter((row: string, index: number) => (index >= A && index <= B));

				let tempArray: any[] = [];

				filteredData.forEach((row: string, index: number) => {
					row.replace("\r", "");
					let elements: string[] = row.split(" ");

					let myObj = {
						P: parseInt(elements[0]),
						K: parseInt(elements[1]),
						D: elements[2].replace(/\r|\n/g, ""),
						timestamp: 0
					};

					tempArray.push(myObj);
				});

				const dataArray = JSON.parse(JSONdata).concat(tempArray);

				// Ordinare i messaggi in ordine di priorita'
				dataArray.sort((a: any, b: any) => b.P - a.P);

				fs.writeFile("utility/dataToProcess.json", JSON.stringify(dataArray), (error) => {
					if (error) {
						console.log(error);
						// throw error;
						return;
					}

					// Cancellare il file salvato in uploads per evitare spreco di memoria
					fs.unlink(path.join(request.file.path), (error) => {
						if (error) {
							console.log(error);
							// throw error;
							return;
						}
					});

					console.log("[File dato in input aggiunto ai dati da processare]");
				});
			});
		}
		catch (error) {
			console.log("[Nessun file dato in input]");
			// throw error;
			return;
		}
	});

	sendPage(response, "text/html", 200, "pages/index.html");
});

// GET request per gestire l'endpoint /pendingData
app.get("/pendingData", (request: any, response: any) => {
	fs.readFile("utility/dataToProcess.json", "utf-8", (error, data) => {
		if (error) {
			console.log(error);
			// throw error;
			return;
		}

		const dataArray = JSON.parse(data);
		response.send(dataArray);
	});
});

// GET request per gestire l'endpoint /data
app.get("/data", (request: any, response: any) => {
	const queryObj: any = request.query;

	fs.readFile("utility/processedData.json", "utf-8", (error, data) => {
		if (error) {
			console.log(error);
			// throw error;
			return;
		}
		let dataArray = JSON.parse(data);

		// Filtraggio secondo query string
		if(queryObj.from) {
			console.log("FROM", queryObj.from, typeof queryObj.from);
			dataArray = dataArray.filter((obj: any) => obj.timestamp > queryObj.from);
		}

		if(queryObj.limit) {
			console.log("LIMIT", queryObj.limit, typeof queryObj.limit);
			dataArray = dataArray.filter((obj: any, index: number) => (index < parseInt(queryObj.limit)));
		}

		response.send(dataArray);
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});


let myInterval: any = setInterval(() => {
	console.log("[-Intervallo 10 secondi-]");

	// ogni 10 secondi bisogna processare al massimo 15 messaggi da "dataToProcess.json" e mettere i valori K e D in un database relazionale
	// estrazione di al massimo 15 messaggi
	fs.readFile("utility/dataToProcess.json", "utf-8", (error, data) => {
		if (error) {
			console.log(error);
			// throw error;
			return;
		}

		if (data == "[]") {
			return;
		}

		let inputDataArray = JSON.parse(data);

		let cutArray: any = inputDataArray.slice(0, 15).filter((obj: any) => {
			if (obj) return true;
			return false;
		});

		let remainingDataArray: any;
		if (inputDataArray.length > 15) {
			remainingDataArray = inputDataArray.slice(15, inputDataArray.length);
		}
		else {
			remainingDataArray = [];
		}

		fs.writeFile("utility/dataToProcess.json", JSON.stringify(remainingDataArray), (error) => {
			if (error) {
				console.log(error);
				// throw error;
				return;
			}
		});

		// Crea la connessione al database
		const connection = mySql2.createConnection({
			host: "localhost",
			port: 3306,
			user: "root",
			password: "",
			database: "messaggi",
			connectTimeout: 5_000
		});

		connection.connect((error) => {
			if (error) {
				console.log(error);
				// throw error;
				return;
			}
		});

		// Ciclo dei max 15 messaggi da mandare al DB
		cutArray.forEach((obj: any) => {
			const sqlStr = `INSERT INTO messaggi (K, D, timestamp) VALUES (?, ?, ?)`;

			obj.timestamp = formatDateForSQL(new Date(Date.now()));
			connection.query(sqlStr, [obj.K, obj.D, obj.timestamp], (error, results) => {
				if (error) {
					console.log(error);
					// throw error;
					return;
				}

				console.log(JSON.stringify(results));
			});
		});

		connection.end();

		fs.readFile("utility/processedData.json", "utf-8", (error, data) => {
			if (error) {
				console.log(error);
				// throw error;
				return;
			}

			let inputDataArray = JSON.parse(data).concat(cutArray);

			fs.writeFile("utility/processedData.json", JSON.stringify(inputDataArray), (error) => {
				if (error) {
					console.log(error);
					// throw error;
					return;
				}
			});
		});
	});
}, 10_000);



function sendPage(response: any, ContentType: string, statusCode: number, url: string) {
	response.setHeader("Content-Type", ContentType);
	response.status(statusCode);
	response.sendFile(url, { root: pagesDirectory });
}

function formatDateForSQL(date: Date) {
	let year = date.getFullYear();
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let day = date.getDate().toString().padStart(2, "0");
	let hour = date.getHours().toString().padStart(2, "0");
	let minute = date.getMinutes().toString().padStart(2, "0");
	let second = date.getSeconds().toString().padStart(2, "0");

	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}