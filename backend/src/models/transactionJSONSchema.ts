import Ajv, { JSONSchemaType } from "ajv";

// 1. Initialize Ajv instance
const ajv = new Ajv();

// 2. Define the JSON schema
const userSchema: JSONSchemaType<{ symbol: string; action: string; quantity: string }> = {
  type: "object",
  properties: {
    symbol: { type: "string" },
    action: { type: "string" },
    quantity: { type: "string" }
  },
  required: ["symbol", "action"],
};

// 3. Compile the schema using Ajv
const transactionValidator = ajv.compile(userSchema);
export default transactionValidator;