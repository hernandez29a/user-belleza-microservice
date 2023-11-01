export class CreateUserDto {
  id: string;
  displayName: string;
  skinType: string;
  gender: ['M', 'F'];
  email: string;
  password: string;
  age: number;
  rol: string;
  img: string;
  status: boolean;
}
