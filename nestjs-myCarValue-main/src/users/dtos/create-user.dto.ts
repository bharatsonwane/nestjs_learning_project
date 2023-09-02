import { IsEmail, IsString } from 'class-validator'
// import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  // @ApiProperty({
  //     // description: 'User Email',
  //     example: 'test@gmail.com',
  // })
  @IsEmail()
  email: string;

  // @ApiProperty({
  //     // description: 'User Email',
  //     example: 'password',
  // })
  @IsString()
  password: string;


}