import redactSensitiveData from "./middlewares/redactSensitiveData";

const middlewares = [redactSensitiveData()];

export default middlewares;
