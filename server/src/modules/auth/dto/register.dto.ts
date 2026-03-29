import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
class MatchPassword implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const object = args.object as RegisterDto;
    return value === object.password;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Mật khẩu xác nhận không khớp với mật khẩu!';
  }
}

export class RegisterDto {
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Số điện thoại không hợp lệ (VD: 098xxxxxxx hoặc +8498xxxxxxx)',
  })
  phone: string;

  @IsString({ message: 'Tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MinLength(3, { message: 'Tên phải ít nhất 3 ký tự' })
  firstName: string;

  @IsString({ message: 'Họ phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ không được để trống' })
  @MinLength(3, { message: 'Họ phải ít nhất 3 ký tự' })
  lastName: string;

  @IsString({ message: 'Password phải là chuỗi' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password: string;

  @IsString({ message: 'Confirm password phải là chuỗi' })
  @IsNotEmpty({ message: 'Confirm password không được để trống' })
  @Validate(MatchPassword)
  confirmPassword: string;
}
