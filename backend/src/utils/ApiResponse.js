class ApiResponse {
    constructor(
        statusCode,
        data,
        message = "Success"
    ) {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400; // status code greater equal to 400 means error;
    }
}

export { ApiResponse };