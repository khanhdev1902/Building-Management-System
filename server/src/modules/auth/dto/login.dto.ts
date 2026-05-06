import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEmail,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  // 👉 PHONE (chỉ validate nếu KHÔNG có email)
  @ValidateIf((o: LoginDto) => !o.email)
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Số điện thoại không hợp lệ (VD: 098xxxxxxx hoặc +8498xxxxxxx)',
  })
  phone?: string;

  // 👉 EMAIL (chỉ validate nếu KHÔNG có phone)
  @ValidateIf((o: LoginDto) => !o.phone)
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email?: string;

  // 👉 PASSWORD
  @IsString({ message: 'Password phải là chuỗi' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password!: string;
}
