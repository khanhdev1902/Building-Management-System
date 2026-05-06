import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from 'src/common/responses/api-response';
import { CreateUserDto, FindAllUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const newUser = await this.userService.create(dto);
    return ApiResponse.success(newUser, 'Tạo người dùng thành công', 201);
  }

  @Get()
  async findAll(@Query() query: FindAllUserDto) {
    const users = await this.userService.findAll(query);
    return ApiResponse.success(
      users,
      'Lấy danh sách người dùng thành công',
      200,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('Fetching user with ID:', id);
    const user = await this.userService.findOne(id);
    return ApiResponse.success(
      user,
      'Lấy thông tin người dùng thành công',
      200,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
