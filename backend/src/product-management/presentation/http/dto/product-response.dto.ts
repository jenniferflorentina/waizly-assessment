export class ProductResponse {
  id: string;

  name: string;

  code: string;

  public constructor(
    id: string,
    name: string,
    code: string,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
  }
}
