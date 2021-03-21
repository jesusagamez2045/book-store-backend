import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly _authService: AuthService){}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signUp(@Body() signupDto: SignUpDto): Promise<void> {
        return this._authService.signUp(signupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    async signIn(@Body() signInDto: SignInDto): Promise<{ token: string }> {
        return this._authService.signIn(signInDto);
    }


}
