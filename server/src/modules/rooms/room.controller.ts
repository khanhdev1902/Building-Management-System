import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { ApiResponse } from 'src/common/responses/api-response';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    console.log('Received CreateRoomDto:', createRoomDto);
    const newRoom = await this.roomService.create(createRoomDto);
    return ApiResponse.success(newRoom, 'Tạo phòng mới thành công!', 201);
  }

  @Get()
  async findAll() {
    const rooms = await this.roomService.findAll();
    return ApiResponse.success(rooms, 'Lấy danh sách phòng thành công !', 200);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
