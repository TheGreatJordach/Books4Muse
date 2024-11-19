import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '@book4-muse/shared';
import { Response } from 'express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('iam')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user and sets an access token cookie upon successful registration.
   *
   * @api {post} /register
   * @apiBody {CreateUserDto} createUserDto - JSON structure for user object.
   * @apiResponse {201} - The record has been successfully created.
   * @apiResponse {403} - Forbidden.
   *
   * @param response - The HTTP response object used to set cookies.
   * @param createUserDto - The data transfer object containing user registration details.
   *
   * @returns Sets an 'accessToken' cookie in the response if registration is successful.
   */
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const accessToken = await this.authService.registerUser(createUserDto);
    response.cookie('accessToken', accessToken, {
      secure: true, // Only secure in production,
      httpOnly: true,
      sameSite: true,
      expires: new Date(Date.now() + 3600000), // Cookie expires in 1 hour
    });
  }

  /**
   * Handles user login by validating credentials and returning user data.
   *
   * @param logInUser - The login details of the user.
   * @returns The authenticated user data if credentials are valid.
   *
   * @api {post} /iam/login
   * @apiBody {LoginUserDto} logInUser - JSON structure for user object.
   * @apiResponse {201} - The user has been successfully connected.
   * @apiResponse {403} - Forbidden.
   */
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully connected.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Json structure for user object',
  })
  @Post('login')
  login(@Body() logInUser: LoginUserDto) {
    return this.authService.logInUser(logInUser);
  }
}
