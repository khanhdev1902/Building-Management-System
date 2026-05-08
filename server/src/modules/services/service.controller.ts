import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { ApiResponse } from 'src/common/responses/api-response';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    const createdService = await this.servicesService.create(createServiceDto);
    return ApiResponse.success(
      createdService,
      'Service created successfully',
      201,
    );
  }

  @Get()
  async findAll() {
    const services = await this.servicesService.findAll();
    return ApiResponse.success(
      services,
      'Services retrieved successfully',
      200,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return ApiResponse.success(service, 'Service retrieved successfully', 200);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceDto,
    );
    return ApiResponse.success(
      updatedService,
      'Service updated successfully',
      200,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedService = await this.servicesService.remove(id);
    return ApiResponse.success(
      deletedService,
      'Service deleted successfully',
      200,
    );
  }
}
