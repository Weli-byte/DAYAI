import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { type ProfilesService } from './profiles.service';
import { type UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user profile by User ID' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getByUserId(@Param('userId') userId: string): Promise<ProfileResponseDto> {
    return this.profilesService.getProfileByUserId(userId);
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({ summary: 'Get or create profile by Wallet Address' })
  @ApiOkResponse({ type: ProfileResponseDto })
  async getByWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.getOrCreateUserByWallet(walletAddress);
  }

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(@Param('userId') userId: string, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateProfile(userId, dto);
  }
}
