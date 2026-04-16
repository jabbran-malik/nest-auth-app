import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }
    async register(dto: RegisterDto) {
        const { email, password } = dto

        // we add check here of user exist or not
        const existingUser = await this.userRepo.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        // Hashpass
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = this.userRepo.create({
            email,
            password: hashedPassword
        });

        // save user to db
        await this.userRepo.save(user);
        return {
            message: 'User registered Successfully',
            userId: user.id,
        }
    }

    async login(dto: LoginDto) {
        const { email, password } = dto;
        // check user
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('invalid credentials');

        }
        // pass check 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('invalid credentials')

        }

        // payload
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }
        // token generate 
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        // 🔥 Refresh Token
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
// refresh token hash
const hashedRt=await bcrypt.hash(refreshToken,10)
// save in db
user.refreshToken=hashedRt;
await this.userRepo.save(user)
        return {
            accessToken,
            refreshToken,
        };


    }
    // refresh Logic
    async refresh(token:string){
        try{
            const payload=this.jwtService.verify(token,{
                secret:'My secret Key',
            })
            const user= await this.userRepo.findOne({
                where :{id:payload.sub}
            })
            if(!user || !user.refreshToken){
                throw new UnauthorizedException();
            }
            const isMatch=await bcrypt.compare(token, user.refreshToken)
            if(!isMatch){
                throw new UnauthorizedException();
            }
            const newAccessToken= this.jwtService.sign(
                {
                    sub:payload.sub,
                    email:payload.email,
                    role:payload.role,
                },
                {expiresIn:'15m'}
            )
            return {
                accessToken:newAccessToken,
            }
        }
        catch(e)
        {
            throw new UnauthorizedException('Invalud Refresh Token')
        }
    }
  async logout(userId: number) {
  await this.userRepo.update(userId, {
    refreshToken: null,
  });

  return {
    message: 'Logged out successfully',
  };
}
}
