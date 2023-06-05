/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(user) {
        const newUser = this.repo.create(user);
        return this.repo.save(newUser);
    }

    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.repo.findOneBy({id});
    }

    findByUsername(username: string) {
        return this.repo.findBy({ username });
    }

    async register(userInfo: any) {
        const users = await this.findByUsername(userInfo.username);
        if (users.length) {
            throw new BadRequestException('Email already in use.');
        }

        const salt = randomBytes(8).toString('hex');

        const hash = await scrypt(userInfo.password, salt, 32) as Buffer;

        const hashedPassword = salt + '.' + hash.toString('hex');

        const user = await this.create({
            name: userInfo.name,
            username: userInfo.username,
            email: userInfo.email,
            password: hashedPassword
        });
    
        return user[0];
    }

    async validateUser(username: string, pass: string) {
        const [user] = await this.findByUsername(username);

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(pass, salt, 32) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException("Incorrect username or password");  
        } 

        return user;
    }
}
