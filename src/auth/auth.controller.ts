import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, EmailToChangePasswordDto, ResetPasswordDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() email: EmailToChangePasswordDto
  ) {
    return this.authService.forgotPassword(email);
  }


  @Post('reset-password/:token')
  public async resetPasswordToken(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
    ) {
    console.log(token);
    return await this.authService.resetPasswordToken(token,resetPasswordDto);
  }

  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }
  
  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
 
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
