
export default function customError(message, status = 500, log=false) {
    const error = new Error(message);
    error.status = status;
    if (log) console.error(`[${status}]  ${message}`);
    throw error;
}