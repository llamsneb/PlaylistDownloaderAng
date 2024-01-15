export interface AuthToken {
  access_token: string,
  token_type: string,
  scope: string,
  refresh_token: string,
  expires_in: number,
  //expires: string,
  //save(response: any): any
}
