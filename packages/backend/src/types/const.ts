export interface Error {
  code: string,
  message: string,
  details: string,
  status: number
}

export interface Errors {
  [key: string]: Error
} 
