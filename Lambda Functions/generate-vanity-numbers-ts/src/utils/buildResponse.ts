export function buildResponse(isSuccess: boolean, vanityNumbers: string): any {
    if (isSuccess) {
        return {
            vanityNumbers: vanityNumbers,
            lambdaResult: "Success"
        };
    }
    else {
        console.error("Lambda returned error to Connect");
        return {
            lambdaResult: "Error"
        };
    }
}