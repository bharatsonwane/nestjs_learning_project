import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const _scrypt = promisify(scrypt);


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {

  }

  async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find(email)
    if (users[0]) {
      throw new BadRequestException('email in use')
    }

    //Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt and the password together
    const hash = (await _scrypt(password, salt, 32)) as Buffer;

    // join the hased result and the salt together
    const result = `${salt}.${hash.toString('hex')}`
    //crate a new user and save it
    const user = await this.usersService.create(email, result)
    //return the user
    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    const [salt, storedHash] = user.password.split('.')

    const hash = (await _scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException("Bad password")
    }
    return user;
  }

}