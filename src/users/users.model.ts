import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { Avatars } from "src/avatars/avatars.model";
import { DocumentsUser } from "src/documents/documents-user.model";
import { Documents } from "src/documents/documents.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

interface UserCreationAttrs {
    password: string;
    initial: string;
    tabel: string;
    image: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Петров Виталий Валентинович', description: 'ФИО'})
    @Column({type: DataType.STRING, allowNull: false})
    initial: string; 

    @ApiProperty({example: '001', description: 'Табельный номер'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    tabel: string; 

    @ApiProperty({example: '01.12.2021', description: 'Дата приема на работу'})
    @Column({type: DataType.STRING, allowNull: true})
    dateWork: string; 

    @ApiProperty({example: '02.12.2021', description: 'Дата увольнения с работы'})
    @Column({type: DataType.STRING, allowNull: true})
    dateUnWork: string; 

    @ApiProperty({example: '02.12.1990', description: 'Дата увольнения с работы'})
    @Column({type: DataType.STRING, allowNull: true})
    birthday: string; 

    @ApiProperty({example: 'Петров В.В.', description: 'Логин'})
    @Column({type: DataType.STRING, allowNull: true})
    login: string; 

    @ApiProperty({example: 'г. Псков., Инженерная ул., д. 2', description: 'Постоянный адрес проживания'})
    @Column({type: DataType.STRING, allowNull: true})
    adress: string; 

    @ApiProperty({example: 'г. Псков., Инженерная ул., д. 2', description: 'Адрес по прописке'})
    @Column({type: DataType.STRING, allowNull: true})
    adressProps: string; 

    @ApiProperty({example: '8-999-892-90-11', description: 'Моб. телефон'})
    @Column({type: DataType.STRING, allowNull: true})
    phone: string; 

    @ApiProperty({example: '...', description: 'Характеристика'})
    @Column({type: DataType.STRING, allowNull: true})
    haracteristic: string; 

    @ApiProperty({example: '...', description: 'Примечание'})
    @Column({type: DataType.STRING, allowNull: true})
    primetch: string; 

    @ApiProperty({example: 'david.perov60@gmail.com', description: 'Почта пользователя'})
    @Column({type: DataType.STRING, allowNull: true})
    email: string;      

    @ApiProperty({example: '12345678', description: 'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'false', description: 'Блокировака пользоваиеля '})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'Уволен', description: 'Причина блокировки пользователя'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @ApiProperty({example: 'http://photo.png', description: 'Аватар пользователя'})
    @Column({type: DataType.STRING, allowNull: true})
    image: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @BelongsToMany(() => Documents, () => DocumentsUser)
    documents: Documents[];
 
    @HasMany(() => Avatars)
    avatars: Avatars[];
}  