export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string
  email?: string;




  // CREATE TABLE user (
  //   id BIGINT PRIMARY KEY,
  //   first_name VARCHAR(100),
  //   last_name VARCHAR(100),
  //   email VARCHAR(255) UNIQUE,
  //   password VARCHAR(255),
  //   role VARCHAR(50),
  //   createdDate DATETIME,
  //   isActive BOOLEAN,
  //   isDeleted BOOLEAN
// );

  [key: string]: unknown;
}
