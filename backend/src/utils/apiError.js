// class ApiError extends Error {

//   constructor(
//     statusCode,
//     message = "Something went wrong",
//     errors = [],
//     stack
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.data = null;
//     this.message = message;
//     this.success = false;
//     this.errors = errors;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export { ApiError };


class ApiError {
  constructor(statusCode, data , message = "something went wrong") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = false


  }
}


export { ApiError };
