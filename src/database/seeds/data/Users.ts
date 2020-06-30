interface UserDTO {
  name: string;
  last_name: string;
  email: string;
  registry: string;
  role_id: number;
  gender_id: number;
  password: string;
}

const UserData: UserDTO[] = [
  {
    name: 'Admin',
    last_name: 'Master',
    email: 'admin@tmfood.com',
    registry: 'admin',
    role_id: 3,
    gender_id: 1,
    password: `${process.env.ADMIN_PASSWORD}`,
  },
];

export default UserData;
