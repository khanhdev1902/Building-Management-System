/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/contracts/contracts.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

import PDFDocument from 'pdfkit';
import * as path from 'path';

import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ContractsService {
  constructor(private prismaService: PrismaService) {}

  // Chạy mỗi ngày lúc 00:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncContractStatus() {
    const now = new Date();

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    // Hết hạn
    await this.prismaService.contract.updateMany({
      where: {
        endDate: {
          lt: now,
        },
        status: {
          not: 'EXPIRED',
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    // Sắp hết hạn
    await this.prismaService.contract.updateMany({
      where: {
        endDate: {
          gte: now,
          lte: thirtyDaysLater,
        },
        status: 'ACTIVE',
      },
      data: {
        status: 'EXPIRING',
      },
    });
  }

  async createContract(dto: CreateContractDto) {
    return await this.prismaService.$transaction(async (tx) => {
      // 1. CHECK ROOM
      const room = await tx.room.findUnique({
        where: {
          id: dto.roomId,
        },
      });

      if (!room) {
        throw new BadRequestException('Phòng không tồn tại');
      }

      const activeContract = await tx.contract.findFirst({
        where: {
          roomId: dto.roomId,
          status: 'ACTIVE',
        },
      });

      if (activeContract) {
        throw new BadRequestException('Phòng hiện đang có hợp đồng hoạt động');
      }

      // 2. CHECK TENANT EXISTS
      const existTenant = await tx.tenant.findFirst({
        where: {
          user: {
            OR: [{ email: dto.email }, { phone: dto.phone }],
          },
        },
        include: {
          user: true,
        },
      });

      let tenantId = existTenant?.id;

      // 3. CREATE NEW TENANT IF NOT EXISTS
      if (!existTenant) {
        const password = '123456';
        const passwordHash = await bcrypt.hash(password, 10);
        const normalizedName = dto.tenantName.trim().replace(/\s+/g, ' ');
        const nameParts = normalizedName.split(' ');
        const firstName = nameParts.pop() || '';
        const lastName = nameParts.join(' ');
        const newUser = await tx.user.create({
          data: {
            firstName,
            lastName,
            passwordHash,
            phone: dto.phone,
            gender: dto.gender,
            email: dto.email,
            role: 'TENANT',
          },
        });

        const newTenant = await tx.tenant.create({
          data: {
            userId: newUser.id,
            citizenId: dto.cccd,
            dateOfBirth: new Date(dto.birthday),
            occupation: dto.occupation,

            hometownProvince: dto.province,
            hometownDistrict: dto.district,
            hometownWard: dto.ward,
            hometownAddress: dto.addressDetail,
          },
        });

        tenantId = newTenant.id;

        // =========================================================
        // CREATE VEHICLES
        // =========================================================

        if (dto.tenantVehicles?.length > 0) {
          await tx.vehicle.createMany({
            data: dto.tenantVehicles.map((vehicle) => ({
              tenantId: newTenant.id,
              type: vehicle.type,
              licensePlate: vehicle.licensePlate,
            })),
          });
        }
      }

      // 4. CALCULATE CONTRACT DATE
      const startDate = new Date(dto.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + dto.duration);

      // 5. CREATE CONTRACT
      const newContract = await tx.contract.create({
        data: {
          roomId: dto.roomId,
          tenantId: tenantId!,
          startDate,
          endDate,
          rentalPrice: dto.rentPrice,
          deposit: dto.deposit,
          status: 'ACTIVE',
          depositStatus: 'UNPAID',
          paymentCycle: Number(dto.paymentCycle),
        },
      });

      // 6. CREATE ROOMMATES
      if (dto.occupants?.length > 0) {
        await tx.roommate.createMany({
          data: dto.occupants.map((o) => ({
            contractId: newContract.id,
            tenantId: tenantId!,
            fullName: o.name,
            citizenId: o.cccd,
            phone: o.phone,
            gender: o.gender,
            occupation: o.occupation,
            dateOfBirth: new Date(o.birthday),
            hometownAddress: o.licensePlate,
          })),
        });
      }

      // 7. CREATE CONTRACT SERVICES
      // if (dto.services?.length > 0) {
      //   await tx.contractService.createMany({
      //     data: dto.services.map((service) => ({
      //       contractId: newContract.id,
      //       serviceId: service.serviceId,
      //       serviceName: service.name,
      //       price: service.price,
      //       unit: service.unit,
      //     })),
      //   });
      // }

      // 8. UPDATE ROOM STATUS
      await tx.room.update({
        where: {
          id: dto.roomId,
        },
        data: {
          status: 'OCCUPIED',
        },
      });

      // 9. RETURN RESULT
      return {
        success: true,
        message: 'Tạo hợp đồng thành công',
        data: {
          contractId: newContract.id,
          tenantId,
          roomId: dto.roomId,
        },
      };
    });
  }
  async getAllContracts() {
    // id: "HD-2026-004",
    // room: "204",
    // tower: "Danjin Block B",
    // tenant: "Hoàng Thu Thảo",
    // avatar: "",
    // startDate: "2026-05-01",
    // endDate: "2026-11-01",
    // deposit: 5000000,
    // rent: 5000000,
    // status: "active",
    // paymentStatus: "partial", // Test cọc thiếu
    const constract = await this.prismaService.contract.findMany({
      include: { tenant: { include: { user: true } }, room: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return constract.map((c) => ({
      id: c.id,
      room: c.room.roomNumber,
      tower: 'Danjin Building',
      avatar: c.tenant.user.avatarUrl,
      tenant: c.tenant.user.lastName + ' ' + c.tenant.user.firstName,
      startDate: c.startDate,
      endDate: c.endDate,
      deposit: c.deposit,
      rent: c.rentalPrice,
      status: c.status,
      paymentStatus: c.depositStatus,
    }));
  }

  async getContractById(id: string) {
    const contract = await this.prismaService.contract.findUnique({
      where: { id },
      include: {
        room: true,
        roommates: true,
        tenant: {
          include: { user: true },
        },
      },
    });

    //   id: "HD-2026-002",
    //   roomNumber: "202",
    //   tower: "Danjin Block A",
    //   rentPrice: 5200000,
    //   deposit: 5000000,
    //   startDate: "2026-02-15",
    //   endDate: "2027-02-15",
    //   paymentCycle: "1 tháng / lần",
    //   status: "active",

    //   // Chỉ số nền đầu kỳ lúc ký kết
    //   initialCounters: {
    //     electric: 2100,
    //     water: 800,
    //   },

    //   // Lý lịch chủ hộ ký tên
    //   primaryTenant: {
    //     name: "Trần Thị Bình",
    //     phone: "0912 333 444",
    //     email: "binh.tran96@gmail.com",
    //     cccd: "037196001234",
    //     avatar: "",
    //     hometown: "Nam Định",
    //     identityVerified: true,
    //   },

    //   // Nhân khẩu ở cùng và biển số xe quản lý thẻ từ
    //   occupants: [
    //     {
    //       name: "Trần Văn An",
    //       cccd: "037198005678",
    //       relation: "Em trai",
    //       licensePlate: "18B1-888.88",
    //     },
    //     {
    //       name: "Lê Thị Mai",
    //       cccd: "038200012345",
    //       relation: "Bạn ở cùng",
    //       licensePlate: "29X1-678.90",
    //     },
    //   ],

    //   // Danh mục định mức dịch vụ đi kèm
    //   services: [
    //     {
    //       name: "Điện tiêu thụ",
    //       price: 3500,
    //       unit: "kWh",
    //       icon: <Zap size={13} className="text-amber-500" />,
    //     },
    //     {
    //       name: "Nước sinh hoạt",
    //       price: 100000,
    //       unit: "Người",
    //       icon: <Droplets size={13} className="text-blue-500" />,
    //     },
    //     {
    //       name: "Phí dịch vụ chung",
    //       price: 150000,
    //       unit: "Phòng",
    //       icon: <Package size={13} className="text-slate-500" />,
    //     },
    //   ],

    //   // Danh sách hóa đơn đã phát sinh thuộc chu kỳ hợp đồng này
    //   billingHistory: [
    //     {
    //       invoiceId: "INV-2026-05",
    //       month: "Tháng 05/2026",
    //       amount: 5650000,
    //       status: "paid",
    //       paidDate: "2026-05-05",
    //     },
    //     {
    //       invoiceId: "INV-2026-04",
    //       month: "Tháng 04/2026",
    //       amount: 5580000,
    //       status: "paid",
    //       paidDate: "2026-04-04",
    //     },
    //     {
    //       invoiceId: "INV-2026-03",
    //       month: "Tháng 03/2026",
    //       amount: 5200000,
    //       status: "paid",
    //       paidDate: "2026-03-05",
    //     }, // Tháng đầu chỉ thu tiền nhà tiền cọc
    //   ],

    //   // Biên bản kiểm kê hiện trạng nội thất bàn giao
    //   assets: [
    //     {
    //       name: "Điều hòa Caspe 12000BTU",
    //       quantity: 1,
    //       status: "Mới 98%, nguyên tem, hoạt động tốt",
    //     },
    //     {
    //       name: "Tủ lạnh Toshiba 180L",
    //       quantity: 1,
    //       status: "Đã qua sử dụng, làm lạnh mượt",
    //     },
    //     {
    //       name: "Giường ngủ sồi Nga + Đệm",
    //       quantity: 1,
    //       status: "Mới 100%, không trầy xước",
    //     },
    //     {
    //       name: "Khóa cửa thông minh vân tay",
    //       quantity: 1,
    //       status: "Hoạt động nhạy, đã reset mã",
    //     },
    //   ],

    //   // Nhật ký tương tác/tác động pháp lý hệ thống
    //   timeline: [
    //     {
    //       date: "2026-02-15 09:30",
    //       action: "Khởi tạo hợp đồng thành công",
    //       user: "Khánh Nguyễn (Manager)",
    //     },
    //     {
    //       date: "2026-02-15 10:15",
    //       action: "Đã thu đủ 9.700.000 đ tiền cọc và tháng đầu",
    //       user: "Hệ thống (Auto)",
    //     },
    //     {
    //       date: "2026-02-15 11:00",
    //       action: "Bàn giao chìa khóa & Kích hoạt nhân khẩu",
    //       user: "Minh Tuấn (Kỹ thuật)",
    //     },
    //   ],
    // };
    return {
      id: contract?.id.slice(0, 10).toUpperCase(),
      roomNumber: '202',
      tower: 'DANJIN BUILDING',
      rentPrice: contract?.rentalPrice.toNumber(),
      deposit: contract?.deposit.toNumber(),
      startDate: contract?.startDate,
      endDate: contract?.endDate,
      paymentCycle: `${1} tháng / lần`,
      status: contract?.status,
      // Chỉ số nền đầu kỳ lúc ký kết
      initialCounters: {
        electric: 0,
        water: 0,
      },
      // Lý lịch chủ hộ ký tên
      primaryTenant: {
        name: `${contract?.tenant.user.lastName} ${contract?.tenant.user.firstName}`,
        phone: contract?.tenant.user.phone,
        email: contract?.tenant.user.email ?? 'chưa có mail',
        cccd: contract?.tenant.citizenId,
        dateOfBirth: contract?.tenant.dateOfBirth,
        occupation: contract?.tenant.occupation,
        avatar: '',
        hometown: `${contract?.tenant.hometownAddress}, ${contract?.tenant.hometownWard}, ${contract?.tenant.hometownDistrict}, ${contract?.tenant.hometownProvince}`,
        identityVerified: true,
      },

      occupants: contract?.roommates.map((t) => ({
        name: t.fullName,
        dateOfBirth: t.dateOfBirth?.toLocaleDateString('vi-VN'),
        cccd: t.citizenId,
        hometownAddress: t.hometownAddress,
        gender: t.gender,
        phone: t.phone,
        occupation: t.occupation,
      })),
      // Danh mục định mức dịch vụ đi kèm
      services: [
        {
          name: 'Điện tiêu thụ',
          price: 3500,
          unit: 'kWh',
          // icon: <Zap size={13} className="text-amber-500" />,
        },
        {
          name: 'Nước sinh hoạt',
          price: 100000,
          unit: 'Người',
          // icon: <Droplets size={13} className="text-blue-500" />,
        },
        {
          name: 'Phí dịch vụ chung',
          price: 150000,
          unit: 'Phòng',
          // icon: <Package size={13} className="text-slate-500" />,
        },
      ],
      billingHistory: [
        {
          invoiceId: 'INV-2026-05',
          month: 'Tháng 05/2026',
          amount: 5650000,
          status: 'paid',
          paidDate: '2026-05-05',
        },
        {
          invoiceId: 'INV-2026-04',
          month: 'Tháng 04/2026',
          amount: 5580000,
          status: 'paid',
          paidDate: '2026-04-04',
        },
        {
          invoiceId: 'INV-2026-03',
          month: 'Tháng 03/2026',
          amount: 5200000,
          status: 'paid',
          paidDate: '2026-03-05',
        }, // Tháng đầu chỉ thu tiền nhà tiền cọc
      ],

      // Biên bản kiểm kê hiện trạng nội thất bàn giao
      assets: [
        {
          name: 'Điều hòa Caspe 12000BTU',
          quantity: 1,
          status: 'Mới 98%, nguyên tem, hoạt động tốt',
        },
        {
          name: 'Tủ lạnh Toshiba 180L',
          quantity: 1,
          status: 'Đã qua sử dụng, làm lạnh mượt',
        },
        {
          name: 'Giường ngủ sồi Nga + Đệm',
          quantity: 1,
          status: 'Mới 100%, không trầy xước',
        },
        {
          name: 'Khóa cửa thông minh vân tay',
          quantity: 1,
          status: 'Hoạt động nhạy, đã reset mã',
        },
      ],

      // Nhật ký tương tác/tác động pháp lý hệ thống
      timeline: [
        {
          date: '2026-02-15 09:30',
          action: 'Khởi tạo hợp đồng thành công',
          user: 'Khánh Nguyễn (Manager)',
        },
        {
          date: '2026-02-15 10:15',
          action: 'Đã thu đủ 9.700.000 đ tiền cọc và tháng đầu',
          user: 'Hệ thống (Auto)',
        },
        {
          date: '2026-02-15 11:00',
          action: 'Bàn giao chìa khóa & Kích hoạt nhân khẩu',
          user: 'Minh Tuấn (Kỹ thuật)',
        },
      ],
    };
  }

  //   async updateContract(id: string, updateData: Partial<CreateContractDto>) {
  //     // TODO: Logic cập nhật hợp đồng
  //     return {
  //       id,
  //       ...updateData,
  //     };
  //   }

  //   async deleteContract(id: string) {
  //     // TODO: Logic xoá hợp đồng
  //     return {
  //       message: `Đã xoá hợp đồng ${id}`,
  //     };
  //   }

  async exportContractPdf(id: string): Promise<Buffer> {
    const contract = await this.prismaService.contract.findUnique({
      where: { id },
      include: {
        room: true,
        roommates: true,
        tenant: {
          include: { user: true },
        },
      },
    });
    const contractData = {
      id: contract?.id.slice(0, 10).toUpperCase(),
      createdAtDate: contract?.createdAt.getDay(),
      createdAtMonth: contract?.createdAt.getMonth(),
      createdAtYear: contract?.createdAt.getFullYear(),
      location: 'Hà Nội',

      partyA: {
        name: 'NGUYỄN Văn Khanh',
        cccd: '001095001234',
        issuedDate: '15/12/2021',
        issuedPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
        permanentAddress:
          'Số 12, Ngõ 45, Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
        currentAddress:
          'Số 12, Ngõ 45, Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
        phone: '090.123.4567',
        houseOwnership:
          'GCN quyền sử dụng đất, quyền sở hữu nhà ở số CC 123456 do UBND Quận Cầu Giấy cấp ngày 20/10/2020',
      },

      partyB: {
        name: `${contract?.tenant.user.lastName} ${contract?.tenant.user.firstName}`,
        cccd: contract?.tenant.citizenId,
        issuedDate: '20/05/2023',
        issuedPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
        permanentAddress:
          'Thôn Đông, Xã Kim Đường, Huyện Ứng Hòa, Thành phố Hà Nội',
        currentAddress:
          'Thôn Đông, Xã Kim Đường, Huyện Ứng Hòa, Thành phố Hà Nội',
        phone: contract?.tenant.user.phone,
      },

      roomNumber: `Phòng số ${contract?.room.roomNumber}, Tòa nhà chung cư DANJIN BUILDING`,
      address:
        'Số 88, Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Thành phố Hà Nội',
      termMonths: 12,
      startDate: '05/06/2026',
      endDate: '05/06/2027',

      rentPrice: 3500000,
      rentPriceText: 'Ba triệu năm trăm nghìn đồng chẵn',
      deposit: 3500000,
      depositText: 'Ba triệu năm trăm nghìn đồng chẵn',
      electricityPrice: 0,
      waterPrice: 0,
    };

    return new Promise<Buffer>((resolve, reject) => {
      // Thiết lập lề tiêu chuẩn (Lề trái rộng hơn lề phải một chút để hỗ trợ đóng gáy đóng tập nếu cần)
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 55, bottom: 65, left: 60, right: 55 },
        bufferPages: true,
      });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // --- NẠP FONT ROBOTO CHUẨN HIỂN THỊ PDF ---
      const fontPath = path.join(process.cwd(), 'src/common/fonts/TIMES.TTF');
      const fontBoldPath = path.join(
        process.cwd(),
        'src/common/fonts/TIMESBD.TTF',
      );
      const fontItalicPath = path.join(
        process.cwd(),
        'src/common/fonts/TIMESI.TTF',
      );

      doc.font(fontPath);
      // Khổ A4 rộng 595. Margins: Trái 60, Phải 55 -> Chiều rộng hiển thị an toàn là 480
      const contentWidth = 480;

      // =========================================================================
      // QUỐC HIỆU TIÊU NGỮ (Dàn Layout bằng 2 block độc lập theo tọa độ X cố định)
      // =========================================================================
      const topY = 55;

      // Cột trái: Tên hệ thống / Số quyết định
      doc.fontSize(9.5).font(fontBoldPath);
      doc.text('HỆ THỐNG DANJIN BMS', 60, topY, {
        width: 180,
        align: 'center',
      });
      doc.fontSize(9).font(fontPath);
      doc.text(`Số: ${contractData.id}/HĐTN-DANJIN`, 60, topY + 16, {
        width: 180,
        align: 'center',
      });

      // Cột phải: Quốc hiệu tiêu ngữ
      doc.fontSize(10).font(fontBoldPath);
      doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 255, topY, {
        width: 285,
        align: 'center',
      });
      doc.fontSize(10.5).text('Độc lập - Tự do - Hạnh phúc', 255, topY + 16, {
        width: 285,
        align: 'center',
      });

      // Kẻ đường gạch dưới Tiêu ngữ
      doc
        .moveTo(325, topY + 32)
        .lineTo(470, topY + 32)
        .lineWidth(1)
        .strokeColor('#000000')
        .stroke();

      // Reset con trỏ trục Y xuống dưới tiêu đề
      doc.y = topY + 60;

      // =========================================================================
      // TIÊU ĐỀ HỢP ĐỒNG
      // =========================================================================
      doc.moveDown(1);
      doc
        .fontSize(13)
        .font(fontBoldPath)
        .text('HỢP ĐỒNG THUÊ NHÀ Ở THƯƠNG MẠI', 60, doc.y, {
          width: contentWidth,
          align: 'center',
        });
      doc
        .fontSize(9.5)
        .font(fontItalicPath)
        .text('(Đáp ứng đầy đủ điều kiện pháp lý phục vụ đăng ký tạm trú)', {
          width: contentWidth,
          align: 'center',
        });
      doc.moveDown(1.5);

      // Ngày tháng lập hợp đồng
      doc.fontSize(11).font(fontItalicPath);
      doc.text(
        `Hôm nay, ngày ${contractData.createdAtDate} tháng ${contractData.createdAtMonth} năm ${contractData.createdAtYear}, tại địa chỉ: ${contractData.address}, chúng tôi gồm các bên dưới đây:`,
        { width: contentWidth, align: 'justify', textIndent: 25, lineGap: 3 },
      );
      doc.moveDown(0.8);

      // =========================================================================
      // THÔNG TIN BÊN A
      // =========================================================================
      doc
        .fontSize(11)
        .font(fontBoldPath)
        .text('BÊN CHO THUÊ NHÀ Ở (BÊN A):', { width: contentWidth });

      doc
        .font(fontPath)
        .text('Ông/Bà: ', { continued: true })
        .font(fontBoldPath)
        .text(contractData.partyA.name);
      doc.font(fontPath);
      doc.text(
        `Số CCCD: ${contractData.partyA.cccd}   |   Ngày cấp: ${contractData.partyA.issuedDate}   |   Nơi cấp: ${contractData.partyA.issuedPlace}`,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(`Hộ khẩu thường trú: ${contractData.partyA.permanentAddress}`, {
        width: contentWidth,
        align: 'justify',
        lineGap: 2,
      });
      doc.text(`Chỗ ở hiện tại: ${contractData.partyA.currentAddress}`, {
        width: contentWidth,
        align: 'justify',
        lineGap: 2,
      });
      doc.text(`Số điện thoại liên hệ: ${contractData.partyA.phone}`, {
        width: contentWidth,
        lineGap: 2,
      });

      doc
        .font(fontPath)
        .text('Cơ sở sở hữu: ', { continued: true })
        .font(fontItalicPath)
        .text(
          `${contractData.partyA.houseOwnership} (Đủ điều kiện cho thuê nhà ở theo quy định pháp luật).`,
          { width: contentWidth, align: 'justify', lineGap: 2 },
        );
      doc.moveDown(0.8);

      // =========================================================================
      // THÔNG TIN BÊN B
      // =========================================================================
      doc
        .fontSize(11)
        .font(fontBoldPath)
        .text('BÊN THUÊ NHÀ Ở (BÊN B):', { width: contentWidth });

      doc
        .font(fontPath)
        .text('Ông/Bà: ', { continued: true })
        .font(fontBoldPath)
        .text(contractData.partyB.name);
      doc.font(fontPath); // Dòng này ngắt trạng thái 'continued' một cách an toàn
      doc.text(
        `Số CCCD: ${contractData.partyB.cccd}   |   Ngày cấp: ${contractData.partyB.issuedDate}   |   Nơi cấp: ${contractData.partyB.issuedPlace}`,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(`Hộ khẩu thường trú: ${contractData.partyB.permanentAddress}`, {
        width: contentWidth,
        align: 'justify',
        lineGap: 2,
      });
      doc.text(`Chỗ ở hiện tại: ${contractData.partyB.currentAddress}`, {
        width: contentWidth,
        align: 'justify',
        lineGap: 2,
      });
      doc.text(`Số điện thoại liên hệ: ${contractData.partyB.phone}`, {
        width: contentWidth,
        lineGap: 2,
      });
      doc.moveDown(0.8);

      // FIX CHÍNH: Chỉ định rõ lề trái X = 60 để buộc PDFKit reset lại dòng chảy văn bản, không bị lệch phải
      doc
        .font(fontPath)
        .text(
          'Các bên thỏa thuận, tự nguyện thống nhất ký kết hợp đồng thuê nhà ở với các điều khoản chi tiết sau đây:',
          60,
          doc.y,
          { width: contentWidth, align: 'justify', lineGap: 2 },
        );
      doc.moveDown(0.8);

      // =========================================================================
      // ĐIỀU 1
      // =========================================================================
      doc
        .font(fontBoldPath)
        .text('ĐIỀU 1: ĐỐI TƯỢNG VÀ THÔNG TIN TÀI SẢN CHO THUÊ', {
          width: contentWidth,
        });
      doc.font(fontPath);
      doc.text(
        `1.1. Bên A đồng ý cho Bên B thuê, và Bên B đồng ý thuê tài sản nhà ở thuộc quyền sở hữu/sử dụng hợp pháp của Bên A tại: ${contractData.roomNumber}.`,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(`1.2. Địa chỉ tài sản: ${contractData.address}.`, {
        width: contentWidth,
        align: 'justify',
        lineGap: 2,
      });
      doc.text(
        '1.3. Mục đích thuê: Dùng để ở, sinh hoạt cá nhân/gia đình và đăng ký quản lý cư trú (khai báo tạm trú) theo đúng quy định của Luật Cư trú hiện hành.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(0.6);

      // =========================================================================
      // ĐIỀU 2
      // =========================================================================
      doc
        .font(fontBoldPath)
        .text('ĐIỀU 2: THỜI HẠN THUÊ VÀ GIA HẠN', { width: contentWidth });
      doc.font(fontPath);
      doc.text(
        `2.1. Thời hạn thuê nhà ở được xác định là ${contractData.termMonths} tháng. Kể từ ngày ${contractData.startDate} đến hết ngày ${contractData.endDate}.`,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(
        '2.2. Hết thời hạn thuê nêu trên, nếu Bên B có nhu cầu tiếp tục thuê thì phải thông báo cho Bên A trước 30 ngày để tiến hành ký kết gia hạn hợp đồng.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(0.6);

      // =========================================================================
      // ĐIỀU 3: BẢNG GIÁ DỊCH VỤ
      // =========================================================================
      doc
        .font(fontBoldPath)
        .text('ĐIỀU 3: GIÁ THUÊ, CHI PHÍ DỊCH VỤ VÀ PHƯƠNG THỨC THANH TOÁN', {
          width: contentWidth,
        });
      doc.font(fontPath);
      doc.text(
        `3.1. Giá thuê nhà ở ấn định cố định trong suốt thời hạn hợp đồng là: ${contractData.rentPrice.toLocaleString('vi-VN')} VNĐ/tháng (Bằng chữ: ${contractData.rentPriceText}).`,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(
        '3.2. Đơn giá dịch vụ tiện ích phát sinh hàng tháng do Bên B chi trả dựa trên chỉ số tiêu thụ thực tế:',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );

      doc.moveDown(0.5);

      if (doc.y > 680) {
        doc.addPage();
      }

      const tY = doc.y;
      const c1 = 60,
        c2 = 100,
        c3 = 295,
        c4 = 435;

      // Vẽ nền Header bảng dịch vụ
      doc
        .rect(60, tY, contentWidth, 22)
        .fill('#f8fafc')
        .strokeColor('#000000')
        .lineWidth(0.5)
        .stroke();
      doc.fillColor('#000000').font(fontBoldPath).fontSize(9.5);

      doc.text('STT', c1, tY + 6, { width: 40, align: 'center' });
      doc.text('Danh mục chi phí dịch vụ', c2, tY + 6, {
        width: 195,
        align: 'left',
      });
      doc.text('Đơn giá thực tế', c3, tY + 6, { width: 140, align: 'center' });
      doc.text('Ghi chú', c4, tY + 6, { width: 100, align: 'center' });

      // --- HÀNG 1: ĐIỆN ---
      const r1Y = tY + 22;
      doc.rect(60, r1Y, contentWidth, 22).strokeColor('#000000').stroke();
      doc.font(fontPath).fontSize(9.5);
      doc.text('1', c1, r1Y + 6, { width: 40, align: 'center' });
      doc.text('Tiền điện sinh hoạt', c2, r1Y + 6, { width: 195 });
      doc.text(
        `${contractData.electricityPrice.toLocaleString('vi-VN')} VNĐ/kWh`,
        c3,
        r1Y + 6,
        { width: 140, align: 'center' },
      );
      doc.text('Đồng hồ riêng', c4, r1Y + 6, { width: 100, align: 'center' });

      // --- HÀNG 2: NƯỚC ---
      const r2Y = r1Y + 22;
      doc.rect(60, r2Y, contentWidth, 22).strokeColor('#000000').stroke();
      doc.text('2', c1, r2Y + 6, { width: 40, align: 'center' });
      doc.text('Tiền nước sạch sinh hoạt', c2, r2Y + 6, { width: 195 });
      doc.text(
        `${contractData.waterPrice.toLocaleString('vi-VN')} VNĐ/m³`,
        c3,
        r2Y + 6,
        { width: 140, align: 'center' },
      );
      doc.text('Đồng hồ riêng', c4, r2Y + 6, { width: 100, align: 'center' });

      // Cố định lại trục Y và reset lề trái 60 sau khi vẽ bảng xong
      doc.y = r2Y + 32;

      doc.fontSize(11);
      doc.text(
        '3.3. Phương thức thanh toán: Định kỳ hàng tháng từ ngày 01 đến ngày 05 hàng tháng bằng hình thức chuyển khoản hoặc tiền mặt.',
        60,
        doc.y,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(0.6);

      // =========================================================================
      // ĐIỀU 4, 5, 6, 7
      // =========================================================================
      doc
        .font(fontBoldPath)
        .text('ĐIỀU 4: TIỀN ĐẶT CỌC ĐẢM BẢO NGHĨA VỤ', { width: contentWidth });
      doc.font(fontPath);
      doc.text(
        `4.1. Bên B giao cho Bên A số tiền đặt cọc bảo đảm là: ${contractData.deposit.toLocaleString('vi-VN')} VNĐ (Bằng chữ: ${contractData.depositText}) ngay khi ký kết hợp đồng này.`,
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(
        '4.2. Khoản đặt cọc sẽ được Bên A hoàn trả nguyên vẹn cho Bên B sau khi thanh lý thanh toán hợp đồng và khấu trừ các thiệt hại vật chất do lỗi Bên B gây ra (nếu có).',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(0.6);

      doc
        .font(fontBoldPath)
        .text('ĐIỀU 5: NGHĨA VỤ PHÁP LÝ HỖ TRỢ TẠM TRÚ CỦA BÊN A', {
          width: contentWidth,
        });
      doc.font(fontPath);
      doc.text(
        '- Bàn giao nhà ở và trang thiết bị kèm theo đúng tình trạng kỹ thuật an toàn thiết yếu.',
        { width: contentWidth, align: 'justify', lineGap: 1 },
      );
      doc.text(
        '- Đảm bảo quyền sử dụng nhà ở độc lập, ổn định và an toàn cho Bên B trong suốt thời hạn hợp đồng.',
        { width: contentWidth, align: 'justify', lineGap: 1 },
      );
      doc.text(
        '- Cam kết hỗ trợ cư trú: Bên A có trách nhiệm cung cấp toàn bộ bản sao hợp pháp các giấy tờ chứng minh quyền sở hữu nhà đất hợp pháp và phối hợp ký tên vào Tờ khai thay đổi thông tin cư trú (Mẫu CT01) để Bên B đăng ký khai báo tạm trú tại cơ quan Công an sở tại theo đúng quy định pháp luật.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(0.6);

      doc
        .font(fontBoldPath)
        .text('ĐIỀU 6: QUYỀN VÀ NGHĨA VỤ CỦA BÊN THUÊ (BÊN B)', {
          width: contentWidth,
        });
      doc.font(fontPath);
      doc.text(
        '- Thanh toán đầy đủ tiền thuê nhà và các chi phí điện, nước tiêu thụ đúng hạn quy định.',
        { width: contentWidth, align: 'justify', lineGap: 1 },
      );
      doc.text(
        '- Sử dụng tài sản đúng mục đích; không được tự ý sửa chữa thay đổi kết cấu công trình khi chưa được sự đồng ý bằng văn bản từ Bên A.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(
        '- Tuân thủ nghiêm túc các quy định pháp luật về an ninh trật tự, an toàn phòng cháy chữa cháy tại tòa nhà chung cư LuxHouse.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(0.6);

      doc
        .font(fontBoldPath)
        .text('ĐIỀU 7: ĐIỀU KHOẢN CHUNG', { width: contentWidth });
      doc.font(fontPath);
      doc.text(
        '7.1. Hợp đồng này có giá trị chứng minh chỗ ở hợp pháp theo Luật Cư trú của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.text(
        '7.2. Hợp đồng được lập thành 02 (hai) bản có giá trị pháp lý hoàn toàn như nhau, mỗi bên giữ 01 bản để làm căn cứ thực hiện thủ tục cư trú và giải quyết tranh chấp.',
        { width: contentWidth, align: 'justify', lineGap: 2 },
      );
      doc.moveDown(1.5);

      // =========================================================================
      // CHỮ KÝ HAI BÊN
      // =========================================================================
      if (doc.y > 640) {
        doc.addPage();
      }

      const signatureY = doc.y;
      doc.font(fontBoldPath).fontSize(11);
      doc.text('ĐẠI DIỆN BÊN A', 60, signatureY, {
        align: 'center',
        width: 215,
      });
      doc.font(fontItalicPath).fontSize(9.5);
      doc.text('(Ký, ghi rõ họ tên)', 60, signatureY + 16, {
        align: 'center',
        width: 215,
      });
      doc
        .font(fontBoldPath)
        .fontSize(11)
        .text(contractData.partyA.name, 60, signatureY + 95, {
          align: 'center',
          width: 215,
        });

      doc.font(fontBoldPath).fontSize(11);
      doc.text('ĐẠI DIỆN BÊN B', 320, signatureY, {
        align: 'center',
        width: 215,
      });
      doc.font(fontItalicPath).fontSize(9.5);
      doc.text('(Ký, ghi rõ họ tên)', 320, signatureY + 16, {
        align: 'center',
        width: 215,
      });
      doc
        .font(fontBoldPath)
        .fontSize(11)
        .text(contractData.partyB.name, 320, signatureY + 95, {
          align: 'center',
          width: 215,
        });

      // =========================================================================
      // ĐÁNH SỐ TRANG ĐỘC LẬP - KHÔNG CẦN VÒNG LẶP, KHÔNG SỢ SẬP APP
      // =========================================================================
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        // Vẽ thanh divider chân trang cố định theo trục tọa độ tuyệt đối mà không cần tắt autoPageBreak
        doc
          .lineWidth(0.5)
          .strokeColor('#cbd5e1')
          .moveTo(55, 795)
          .lineTo(540, 795)
          .stroke();

        // Ghi text góc dưới trái
        doc.fillColor('#475569').font(fontItalicPath).fontSize(8.5);
        doc.text(
          `Hợp đồng thuê nhà ở số: ${contractData.id}/HĐTN-DANJIN`,
          55,
          805,
          { lineBreak: false },
        );

        // Ghi Số Trang góc dưới phải
        doc
          .font(fontPath)
          .fontSize(9)
          .text(`Trang ${i + 1} / ${range.count}`, 490, 805, {
            align: 'right',
            // width: 140,
            lineBreak: false,
          });
      }

      doc.end();
    });
  }
}
