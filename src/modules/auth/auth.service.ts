import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/roletype.enum';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { LoggedInDto, SignInDto, SignUpDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private readonly _authRepository: AuthRepository,
        private readonly _jwtService: JwtService
    ){}

    async signUp(signUpDto: SignUpDto): Promise<void> {
        const {username, email} = signUpDto;
        const userExist = await this._authRepository.findOne({where: [{username}, {email}]});

        if(userExist){
            throw new ConflictException("El usuario o el email ya existen");
        }

        return this._authRepository.signUp(signUpDto);
    }

    async signIn(signInDto: SignInDto): Promise<LoggedInDto> {
        const {username, password} = signInDto;
        const user: User = await this._authRepository.findOne({
            where: {username},
        });

        if(!user){
            throw new NotFoundException("El usuario no existe");
        }

        const isMatch = await compare(password, user.password);

        if(!isMatch){
            throw new UnauthorizedException("Usuario o contraseña invalida");
        }

        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(r => r.name as RoleType)
        };

        const token = await this._jwtService.sign(payload);

        return plainToClass(LoggedInDto, {token, user});
    }
}
