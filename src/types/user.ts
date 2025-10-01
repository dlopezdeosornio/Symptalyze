export interface User {
    firstName: string;
    lastName: string;
    name: string;
    gender: "male" | "female" | "other";
    birthday: string; // YYYY-MM-DD
    age: number;
    email: string;
    password: string;
  }