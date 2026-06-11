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
import { FindAllUserDto, UpdateUserDto } from './dto';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/tenants')
  async createTenant(@Body() dto: CreateTenantDto) {
    const newTenant = await this.userService.createTenant(dto);
    return ApiResponse.success(newTenant, 'Tạo người dùng thành công', 201);
  }

  @Get('/tenants')
  async getAllTenants(@Query() query: FindAllUserDto) {
    console.log(query);
    const tenants = await this.userService.getAllTenants();
    return ApiResponse.success(
      tenants,
      'Lấy danh sách cư dân thành công !',
      200,
    );
  }

  @Get('/tenants/:id')
  async getTenantById(@Param('id') id: string) {
    console.log('Fetching user with ID:', id);
    const tenant = await this.userService.getTenantById(id);
    return ApiResponse.success(tenant, 'Lấy thông tin cư dân thành công!', 200);
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
