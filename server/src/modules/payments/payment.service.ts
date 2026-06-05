/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async handleSepay(data: any) {
    // SePay dùng transferAmount, không phải amount
    console.log('haha');
    const { transferAmount, content } = data;

    if (!content) return;

    // 1. Extract orderCode (Ví dụ: OD2603217548)
    const invoiceCode = this.extractOrderCode(content);
    console.log(invoiceCode);

    if (!invoiceCode) {
      return console.log(
        'Không tìm thấy mã đơn hàng (OrderCode) trong nội dung chuyển khoản',
      );
    }

    // 2. Tìm đơn hàng theo orderCode (Dùng findFirst vì orderCode thường là Unique)
    const invoice = await this.prisma.invoice.findUnique({
      where: { invoiceCode },
    });

    if (!invoice) {
      console.warn(`Không tìm thấy đơn hàng với mã: ${invoiceCode}`);
      return;
    }

    // 3. Kiểm tra trạng thái và số tiền
    // Lưu ý: So sánh transferAmount (từ webhook) với totalAmount (từ DB)
    if (invoice.status !== 'UNPAID') {
      console.warn(
        `Đơn hàng ${invoiceCode} đã được xử lý trước đó hoặc không ở trạng thái PENDING`,
      );
      return;
    }

    // if (Number(transferAmount) < Number(invoice.totalAmount)) {
    //   console.warn(
    //     `Đơn hàng ${invoiceCode}: Số tiền chuyển (${transferAmount}) nhỏ hơn tổng tiền (${Number(invoice.totalAmount)})`,
    //   );
    //   return;
    // }

    // 4. Update trạng thái
    // Thường thanh toán xong thì là PAID hoặc PROCESSING, bạn đang để DELIVERED (Giao thành công) thì tùy logic app nhé
    await this.prisma.invoice.update({
      where: { invoiceCode },
      data: {
        status: 'PAID',
        // : 'SUCCESS', // Đổi thành trạng thái thanh toán thành công
        // paymentStatus: 'PAID' // Nếu bạn có trường riêng cho payment
      },
    });

    await this.prisma.receipt.create({
      data: {
        invoiceId: invoice.id,
        receiptCode: invoiceCode,
        paymentMethod: 'Chuyển Khoản ngân hàng',
        amount: transferAmount,
        status: 'Tốt:))',
      },
    });

    console.log(
      `Đơn hàng ${invoiceCode} thanh toán thành công ${transferAmount}đ`,
    );
  }

  // Tách mã đơn hàng dựa trên data thực tế bạn gửi
  private extractOrderCode(content: string): string | null {
    // Regex tìm chuỗi bắt đầu bằng OD và theo sau là 10 chữ số (khớp với OD2603217548)
    // Hoặc linh hoạt hơn: /OD\d+/
    const match = content.match(/OD\d+/);
    return match ? match[0] : null;
  }
}
