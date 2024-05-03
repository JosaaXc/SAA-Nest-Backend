import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, EmailToChangePasswordDto, ResetPasswordDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators';
import { User } from './entities/user.entity';


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

  @Patch('change-password')
  @Auth()
  changePassword(
    @GetUser() user: User,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.changePassword(user, resetPasswordDto);
  }
  
  @Post('reset-password/:token')
  public async resetPasswordToken(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
    ) {
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
