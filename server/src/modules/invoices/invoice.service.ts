/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { InvoiceDataDto } from './dto/invoice-data.dto';
import { addDays } from 'date-fns';
import PDFDocument from 'pdfkit';
import * as path from 'path';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  private generateOrderCode() {
    const date = new Date();

    const y = date.getFullYear().toString().slice(-2);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    const random = Math.floor(1000 + Math.random() * 9000);

    return `OD${y}${m}${d}${random}`;
  }

  async getAllInvoices() {
    const invoices = await this.prisma.invoice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        contract: {
          include: {
            room: true,
            tenant: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        items: true,
      },
    });
    return invoices.map((invoice) => {
      const roomNo = invoice.contract.room.roomNumber;
      const tenantUser = invoice.contract.tenant.user;
      const fullName = `${tenantUser.lastName} ${tenantUser.firstName}`;
      const amount = invoice.totalAmount.toNumber();

      const rawDescription = `${fullName}_P${roomNo}_Thanh Toan tien phong ky ${invoice.billingPeriod} ${invoice.invoiceCode}`;
      const encodedDes = encodeURIComponent(rawDescription);
      const qrUrl = `https://qr.sepay.vn/img?acc=VQRQAJEQY6518&bank=MBBank&amount=${2000}&des=${encodedDes}`;

      return {
        id: invoice.id,
        roomNumber: roomNo,
        qrUrl: qrUrl,
        tenantName: fullName,
        totalAmount: invoice.totalAmount,
        billingPeriod: invoice.billingPeriod,
        status: invoice.status,
        dueDate: invoice.deadline.toLocaleDateString('vi-VN'),
        invoiceItems: invoice.items.map((item) => ({
          itemName: item.itemName,
          type: item.type,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice.toNumber(),
          subTotal: item.subTotal.toNumber(),
          previousReading: item.previousReading ?? null,
          currentReading: item.currentReading ?? null,
        })),
      };
    });
  }
  async buildInvoiceData() {
    const now = new Date();
    const billingPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const rooms = await this.prisma.room.findMany({
      where: {
        contracts: {
          some: {
            OR: [{ status: 'ACTIVE' }, { status: 'EXPIRING' }],
          },
        },

        NOT: {
          contracts: {
            some: {
              invoices: {
                some: { billingPeriod: billingPeriod },
              },
            },
          },
        },
      },

      include: {
        contracts: {
          where: {
            OR: [{ status: 'ACTIVE' }, { status: 'EXPIRING' }],
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,

          include: {
            tenant: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },

        meters: {
          where: {
            isBilled: false,
          },
          orderBy: {
            recordedDate: 'desc',
          },
        },

        roomServices: {
          include: {
            service: true,
          },
        },
      },
    });

    const invoiceData = rooms
      .map((room) => {
        const contract = room.contracts[0];

        if (!contract) return null;
        const electricMeter = room.meters.find((m) => m.service === 'ELECTRIC');
        const waterMeter = room.meters.find((m) => m.service === 'WATER');
        const electricService = room.roomServices.find(
          (s) => s.service.name === 'Điện',
        );

        const waterService = room.roomServices.find(
          (s) => s.service.name === 'Nước',
        );

        const items: any[] = [];

        console.log('--- Room:', room.roomNumber);
        console.log('--- Electric Meter:', electricMeter);
        console.log('--- Water Meter:', waterMeter);
        console.log('--- Electric Service:', electricService);
        console.log('--- Water Service:', waterService);

        // =========================
        // TIỀN PHÒNG
        // =========================

        items.push({
          type: 'ROOM',
          itemName: 'Tiền phòng',
          quantity: 1,
          unit: 'Tháng',
          unitPrice: Number(contract.rentalPrice),
          subTotal: Number(contract.rentalPrice),
          previousReading: null,
          currentReading: null,
        });

        // =========================
        // TIỀN ĐIỆN
        // =========================

        if (electricMeter && electricService) {
          const quantity =
            electricMeter.currentValue - electricMeter.previousValue;

          items.push({
            type: 'ELECTRIC',
            itemName: electricService.service.name,
            quantity,
            unit: electricService.service.unit,
            unitPrice: Number(electricService.service.price),
            subTotal: quantity * Number(electricService.service.price),
            previousReading: electricMeter.previousValue,
            currentReading: electricMeter.currentValue,
            meterId: electricMeter.id,
          });
        }

        // =========================
        // TIỀN NƯỚC
        // =========================

        if (waterMeter && waterService) {
          const quantity = waterMeter.currentValue - waterMeter.previousValue;

          items.push({
            type: 'WATER',
            itemName: waterService.service.name,
            quantity,
            unit: waterService.service.unit,
            unitPrice: Number(waterService.service.price),
            subTotal: quantity * Number(waterService.service.price),
            previousReading: waterMeter.previousValue,
            currentReading: waterMeter.currentValue,
            meterId: waterMeter.id,
          });
        }

        // =========================
        // DỊCH VỤ KHÁC
        // =========================

        room.roomServices
          .filter(
            (rs) => rs.service.name !== 'Điện' && rs.service.name !== 'Nước',
          )
          .forEach((rs) => {
            items.push({
              type: 'SERVICE',
              itemName: rs.service.name,
              quantity: 1,
              unit: rs.service.unit,
              unitPrice: Number(rs.service.price),
              subTotal: Number(rs.service.price),
              previousReading: null,
              currentReading: null,
            });
          });

        const totalAmount = items.reduce((sum, item) => sum + item.subTotal, 0);

        return {
          roomId: room.id,
          roomNumber: room.roomNumber,
          billingPeriod,
          contractId: contract.id,
          tenantName: `${contract.tenant.user.lastName} ${contract.tenant.user.firstName}`,
          totalAmount,
          items,

          meterIds: {
            electric: electricMeter?.id,
            water: waterMeter?.id,
          },
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return invoiceData;
  }

  async createInvoice(data: InvoiceDataDto) {
    const meterIds = [data.meterIds.electric, data.meterIds.water].filter(
      (id): id is number => id !== undefined,
    );

    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceCode: this.generateOrderCode(),
          billingPeriod: data.billingPeriod,
          contractId: data.contractId,
          totalAmount: data.totalAmount,
          paidAmount: 0,
          balance: data.totalAmount,
          status: 'UNPAID',
          overdueFee: 0,
          deadline: addDays(new Date(), 7),

          items: {
            create: data.items.map((item) => ({
              type: item.type,
              itemName: item.itemName,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              subTotal: item.subTotal,
              previousReading: item.previousReading,
              currentReading: item.currentReading,
            })),
          },
        },
      });

      await tx.meter.updateMany({
        where: {
          id: {
            in: meterIds,
          },
        },
        data: {
          isBilled: true,
        },
      });

      return invoice;
    });
  }

  async createInvoices(invoiceData: InvoiceDataDto[]) {
    const promises = invoiceData.map((data) => this.createInvoice(data));
    return Promise.all(promises);
  }

  async generateInvoices() {
    console.log('Starting invoice generation process...');
    const invoiceData = await this.buildInvoiceData();
    const createdInvoices = await this.createInvoices(invoiceData);

    console.log('Invoice generation completed.');

    return { invoiceData, createdInvoices };
  }
  async getInvoiceById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        contract: {
          select: {
            room: true,
            tenant: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    const roomNo = invoice.contract.room.roomNumber;
    const tenantUser = invoice.contract.tenant.user;
    const fullName = `${tenantUser.lastName} ${tenantUser.firstName}`;
    const amount = invoice.totalAmount.toNumber();

    const rawDescription = `${fullName}_P${roomNo}_Thanh Toan tien phong ky ${invoice.billingPeriod}`;
    const encodedDes = encodeURIComponent(rawDescription);
    const qrUrl = `https://qr.sepay.vn/img?acc=VQRQAJEQY6518&bank=MBBank&amount=${amount}&des=${encodedDes}`;
    return {
      id: invoice.id,
      tenantName: fullName,
      roomNumber: roomNo,
      qrUrl: qrUrl,
      billingPeriod: invoice.billingPeriod,
      paymentDeadline: invoice.deadline.toLocaleDateString('vi'),
      totalAmount: amount,
      createdAt: invoice.createdAt.toLocaleDateString('vi'),
      items: invoice.items.map((i) => {
        let detail = '';
        switch (i.type) {
          case 'ROOM':
            detail = `Tiền thuê phòng kỳ ${invoice.billingPeriod}`;
            break;

          case 'ELECTRIC':
            detail = `Chỉ số ${i.previousReading} → ${i.currentReading} (${i.quantity} kWh × ${i.unitPrice.toNumber().toLocaleString('vi-VN')}đ)`;
            break;

          case 'WATER':
            detail = `Chỉ số ${i.previousReading} → ${i.currentReading} (${i.quantity} m³ × ${i.unitPrice.toNumber().toLocaleString('vi-VN')}đ)`;
            break;

          case 'SERVICE':
            detail = `${i.quantity} ${i.unit} × ${i.unitPrice.toNumber().toLocaleString('vi-VN')}đ`;
            break;

          default:
            detail = '';
        }

        return {
          name: i.itemName,
          type: i.type,
          detail,
          amount: i.subTotal.toNumber(),
        };
      }),
    };
  }

  async exportInvoicePdf(id: string): Promise<Buffer> {
    const invoice = await this.getInvoiceById(id);
    // 1. DATA MOCKUP CHI TIẾT & CHUYÊN NGHIỆP CHUẨN BMS
    const invoiceData = {
      id: id.substring(0, 8).toUpperCase(),
      companyName: 'CÔNG TY QUẢN LÝ BẤT ĐỘNG SẢN DANJIN BMS',
      companyAddress:
        'Tầng 2, DANJIN Center, 275 Nguyễn Trãi, Thanh Xuân, Hà Nội, Việt Nam',
      companyHotline: '0345755059 - danjin.bms@gmail.com',

      customerName: `${invoice.tenantName}`,
      roomNumber: `P.${invoice.roomNumber} - Tòa DANJIN Center`,
      billingPeriod: `Tháng ${invoice.billingPeriod}`,
      paymentMethod: 'Chuyển khoản Ngân hàng',
      paymentDeadline: `${invoice.paymentDeadline}`,
      createdAt: `${invoice.createdAt}`,
      items: invoice.items,
      totalAmount: invoice.totalAmount,
      bankInfo: 'MB Bank - STK: VQRQAJEQY6518 - Chủ TK: NGUYEN VAN KHANH',
    };

    return new Promise<Buffer>((resolve, reject) => {
      // Khởi tạo document với margin hẹp hơn một chút để tối ưu không gian bảng
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Buffer[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      doc.on('error', (err) => reject(err));

      // --- NẠP FONT ROBOTO ---
      const fontPath = path.join(process.cwd(), 'src/common/fonts/TIMES.TTF');
      const fontBoldPath = path.join(
        process.cwd(),
        'src/common/fonts/TIMESBD.TTF',
      );
      doc.font(fontPath);

      // =========================================================================
      // HEADER: THÔNG TIN BAN QUẢN LÝ TÒA NHÀ
      // =========================================================================
      doc
        .fillColor('#1e293b')
        .fontSize(11)
        .font(fontBoldPath)
        .text(invoiceData.companyName, 40, 40);
      doc
        .fillColor('#64748b')
        .fontSize(9)
        .font(fontPath)
        .text(invoiceData.companyAddress);
      doc.text(`Hotline/Email: ${invoiceData.companyHotline}`);

      // Vẽ đường kẻ phân cách Header
      doc
        .moveTo(40, 85)
        .lineTo(555, 85)
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .stroke();

      // =========================================================================
      // TITLE & MÃ HÓA ĐƠN
      // =========================================================================
      doc
        .fillColor('#0f172a')
        .fontSize(20)
        .font(fontBoldPath)
        .text('THÔNG BÁO THANH TOÁN TIỀN PHÒNG', 40, 105, { align: 'center' });
      doc
        .fillColor('#64748b')
        .fontSize(10)
        .font(fontPath)
        .text(`Kỳ hóa đơn: ${invoiceData.billingPeriod}`, { align: 'center' });
      doc.moveDown(1.5);

      // =========================================================================
      // METADATA: THÔNG TIN KHÁCH HÀNG & PHÒNG (Chia làm 2 cột Trái - Phải)
      // =========================================================================
      const currentY = doc.y;

      // Cột bên Trái: Khách hàng
      doc
        .fillColor('#1e293b')
        .fontSize(10)
        .font(fontBoldPath)
        .text('THÔNG TIN KHÁCH THUÊ', 40, currentY);
      doc.font(fontPath).fillColor('#334155');
      doc.text(`Khách hàng: ${invoiceData.customerName}`, 40, currentY + 18);
      doc.text(`Số phòng: ${invoiceData.roomNumber}`, 40, currentY + 34);
      doc.text(`Hình thức: ${invoiceData.paymentMethod}`, 40, currentY + 50);

      // Cột bên Phải: Hóa đơn
      doc
        .fillColor('#1e293b')
        .font(fontBoldPath)
        .text('CHI TIẾT CHỨNG TỪ', 340, currentY);
      doc.font(fontPath).fillColor('#334155');
      doc.text(`Mã hóa đơn: INV-${invoiceData.id}`, 340, currentY + 18);
      doc.text(`Ngày phát hành: ${invoiceData.createdAt}`, 340, currentY + 34);
      doc
        .fillColor('#b91c1c')
        .font(fontBoldPath)
        .text(
          `Hạn thanh toán: ${invoiceData.paymentDeadline}`,
          340,
          currentY + 50,
        );

      doc.moveDown(2.5);

      // =========================================================================
      // TABLE GRID: BẢNG CHI TIẾT DỊCH VỤ (Vẽ thủ công cực kỳ chuẩn chỉ)
      // =========================================================================
      let tableY = doc.y;

      // Header của Bảng
      doc.rect(40, tableY, 515, 24).fill('#f1f5f9'); // Tạo background xám nhạt cho header
      doc.fillColor('#1e293b').font(fontBoldPath).fontSize(9);
      doc.text('STT', 50, tableY + 8, { width: 30 });
      doc.text('DANH MỤC DỊCH VỤ / CHI PHÍ', 90, tableY + 8, { width: 300 });
      doc.text('THÀNH TIỀN (VNĐ)', 440, tableY + 8, {
        width: 110,
        align: 'right',
      });

      tableY += 24;
      doc.font(fontPath).fontSize(9.5).fillColor('#334155');

      // Vòng lặp render các hàng dữ liệu
      invoiceData.items.forEach((item, index) => {
        doc
          .font(fontBoldPath)
          .fillColor('#1e293b')
          .text(`${index + 1}`, 50, tableY + 6);

        // Vẽ Tên dịch vụ cứng
        doc
          .font(fontBoldPath)
          .fillColor('#1e293b')
          .text(item.name, 90, tableY + 6);
        // Vẽ chi tiết/chỉ số điện nước chữ nhỏ hơn bên dưới
        doc
          .font(fontPath)
          .fillColor('#64748b')
          .fontSize(8.5)
          .text(item.detail, 90, tableY + 18);

        // Vẽ tiền canh lề phải
        doc
          .font(fontBoldPath)
          .fillColor('#0f172a')
          .fontSize(9.5)
          .text(item.amount.toLocaleString('vi-VN'), 440, tableY + 10, {
            width: 110,
            align: 'right',
          });

        tableY += 34; // Tăng tọa độ Y cho hàng tiếp theo

        // Vẽ đường kẻ mờ phân tách giữa các hàng
        doc
          .moveTo(40, tableY)
          .lineTo(555, tableY)
          .strokeColor('#e2e8f0')
          .lineWidth(0.5)
          .stroke();
      });

      // =========================================================================
      // TOTAL & PAYMENT INFO (Tổng tiền và Thông tin chuyển khoản)
      // =========================================================================
      tableY += 15;

      // Khung tổng tiền nổi bật màu đỏ đậm quý phái
      doc.rect(320, tableY, 235, 30).fill('#fef2f2');
      doc
        .fillColor('#991b1b')
        .font(fontBoldPath)
        .fontSize(11)
        .text('TỔNG TIỀN CẦN LẬP:', 330, tableY + 10);
      doc
        .fontSize(12)
        .text(
          `${invoiceData.totalAmount.toLocaleString('vi-VN')} VNĐ`,
          430,
          tableY + 10,
          { width: 115, align: 'right' },
        );

      // Hướng dẫn thanh toán ngân hàng phía dưới bên trái
      doc
        .fillColor('#1e293b')
        .font(fontBoldPath)
        .fontSize(9.5)
        .text('Thông tin tài khoản nhận tiền:', 40, tableY + 5);
      doc.font(fontPath).fillColor('#475569').fontSize(9);
      doc.text(`• ${invoiceData.bankInfo}`);
      doc.text(
        '• Nội dung CK cú pháp: [Tên Khách Hàng] [Số Phòng] đóng tiền phòng',
      );

      // =========================================================================
      // FOOTER SIGNATURE: CHỮ KÝ BAN QUẢN LÝ
      // =========================================================================
      const footerY = tableY + 80;
      doc
        .fillColor('#1e293b')
        .fontSize(10)
        .font(fontBoldPath)
        .text('ĐẠI DIỆN BAN QUẢN LÝ', 380, footerY, {
          align: 'center',
          width: 150,
        });
      doc
        .fillColor('#64748b')
        .fontSize(8.5)
        .font(fontPath)
        .text('(Ký, đóng dấu và ghi rõ họ tên)', 380, footerY + 14, {
          align: 'center',
          width: 150,
        });

      // Lời chúc/Lời cảm ơn cuối trang định vị cố định ở đáy
      doc
        .fillColor('#94a3b8')
        .fontSize(9)
        .font(fontPath)
        .text(
          'Cảm ơn quý khách đã đồng hành cùng DanJin BMS! Chúc một ngày tốt lành.',
          40,
          760,
          { align: 'center', width: 515, italic: true },
        );

      doc.end();
    });
  }
}
