import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, EmailToChangePasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ){}

  async create(createAuthDto: CreateUserDto) {

    try {

      const { password, ...userData } = createAuthDto;
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hash(password, 10)
      });
      await this.userRepository.save(user);
      //TODO: Discomment on production
      // await this.emailService.sendCredentialsToUser(createAuthDto);
      delete user.password;

      return user;

    } catch (error) {
      handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, roles: true }
    });

    if(!user) 
      throw new UnauthorizedException('Invalid credentials(email)');

    if( !bcrypt.compareSync(password, user.password ) )
      throw new UnauthorizedException('Invalid credentials(password)');

    delete user.password; 

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }, { expiresIn: '1d'})
    }

  }

  async changePassword( user: User, resetPasswordDto: ResetPasswordDto ){
      
    await this.checkPasswordChangeAt(user);
    const { password } = resetPasswordDto;
    
    try {
      const now = new Date();
      await this.userRepository.update(user.id, {
        password: await bcrypt.hash(password, 10),
        passwordChangedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      });
      return { message: 'Password updated successfully' };

    } catch (error) {
      handleDBError(error);
    }
  }

  async forgotPassword({ email }: EmailToChangePasswordDto ){

    const user = await this.userRepository.findOne({ where: { email } });
    await this.checkPasswordChangeAt(user);

      if(!user) 
        throw new BadRequestException(`User with email ${ email } not found`);

    try {
  
      const token = this.getJwtToken({ id: user.id }, { expiresIn: '10m' });
      await this.emailService.sendEmailForgotPassword(user, token);

      return { message: 'Email sent successfully' };

    } catch (error) {
      handleDBError(error);
    }

  }

  async resetPasswordToken(token: string, resetPasswordDto: ResetPasswordDto) {
    const { password } = resetPasswordDto;

    let payload: JwtPayload ;
    try {
        payload = this.jwtService.verify(token) as JwtPayload;
    } catch (error) {
        handleDBError(error);
    }

    const { id } = payload;

    const user = await this.userRepository.findOne({ where: { id } });
    if(!user) 
      handleDBError(new BadRequestException('User not found'));

    try {
        await this.userRepository.update(id, {
            password: await bcrypt.hash(password, 10)
        });

        return { message: 'Password updated successfully' };

    } catch (error) {
        handleDBError(error);
    }
  }

  private getJwtToken(payload: JwtPayload, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  private async checkPasswordChangeAt(user: User) {
    const { passwordChangedAt } = await this.userRepository.findOne({ where: { id: user.id } });

    if(passwordChangedAt) {
      const now = new Date();
      const lastChanged = new Date(passwordChangedAt);
      const diff = now.getTime() - lastChanged.getTime();
      const days = diff / (1000 * 60 * 60 * 24);

      if(days < 30) 
        throw new BadRequestException('You can only change your password every 30 days');
    }
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUser(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      return updatedUser;
    } catch (error) {
      handleDBError(error);
    }
  }

  async deleteUser(id: string) {
    try {
      await this.userRepository.delete(id);
      return { message: 'User deleted' };
    } catch (error) {
      handleDBError(error);
    }
  }
}
