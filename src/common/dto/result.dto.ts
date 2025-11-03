export class ResultWithData<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T | null,
  ) {}
}

export class Result {
  constructor(
    public success: boolean,
    public message: string,
  ) {}
}
