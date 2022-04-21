import createTables from "./scripts/createTables";
import dropTables from "./scripts/dropTables";
import seedTables from "./scripts/seeder";

switch (process.argv[2]) {
	case "create": {
		createTables().catch(() => {});
		break;
	}
	case "destroy": {
		dropTables().catch(() => {});
		break;
	}
	case "seed": {
		seedTables().catch(() => {});
		break;
	}
	case "reseed": {
		dropTables()
			.then(() => createTables())
			.then(() => seedTables())
			.catch(() => {});
		break;
	}
}
