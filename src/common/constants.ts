/* eslint-disable prettier/prettier */
export enum RabbitMQ {
  UserQueue = 'users',
}

export enum UserMSG {
  CREATE = 'CREATE_USER',
  REGISTER = 'REGISTER_USER',
  FIND_ALL = 'FIND_USERS',
  FIND_ONE = 'FIND_USER',
  UPDATE = 'UPDATE_USER',
  DELETE = 'DELETE_USER',
  GET_EMAIL = 'EMAIL_USER',
  VALID_USER = 'VALID_USER',
  RENEW_TOKEN = 'RENEW_TOKEN',
}
