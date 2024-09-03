class ApiResponse {
  constructor(statusCode, data, message = "success") {
    if (typeof statusCode !== 'number') {
      throw new Error('statusCode must be a number');
    }


    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;


  }
}


export { ApiResponse };
