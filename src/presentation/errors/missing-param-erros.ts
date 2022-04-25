class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Mising Param: ${paramName}`);
    this.name = "MissingParamError";
  }
}

export { MissingParamError };
