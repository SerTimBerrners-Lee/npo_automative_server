import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsEmail } from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    readonly email: string;
    @ApiProperty({example: '12345678', description: 'Пароль'})
    readonly password: string;
    @ApiProperty({example: 'Петров Виталий Валентинович', description: 'ФИО'})
    readonly initial: string;
    @ApiProperty({example: '001', description: 'Табельный номер'})
    readonly tabel: string

    @ApiProperty({example: '01.12.2021', description: 'Дата приема на работу'})
    readonly dateWork: string
    @ApiProperty({example: '01.12.2021', description: 'Дата приема на работу'})
    readonly dateUnWork: string

    @ApiProperty({example: '02.12.1990', description: 'Дата увольнения с работы'})
    readonly birthday: string; 

    @ApiProperty({example: 'Петров В.В.', description: 'Логин'})
    readonly login: string; 

    @ApiProperty({example: '1', description: 'Идентификатор роли'})
    readonly roles: string; 

    @ApiProperty({example: 'г. Псков., Инженерная ул., д. 2', description: 'Постоянный адрес проживания'})
    readonly adress: string; 
    @ApiProperty({example: 'г. Псков., Инженерная ул., д. 2', description: 'Адрес по прописке'})
    readonly adressProps: string; 
    @ApiProperty({example: '8-999-892-90-11', description: 'Моб. телефон'})
    readonly phone: string; 
    @ApiProperty({example: '...', description: 'Характеристика'})
    readonly haracteristic: string; 
    @ApiProperty({example: '...', description: 'Примечание'})
    readonly primetch: string; 
    @ApiProperty({example: '...', description: 'Аватарка пользователя'})
    readonly image: string; 
}