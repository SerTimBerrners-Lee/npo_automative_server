import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo, BeforeSync, BeforeInit, AfterSync, AfterDefine } from "sequelize-typescript";
import { Actions } from "src/actions/actions.model";
import { Avatars } from "src/avatars/avatars.model";
import { Detal } from "src/detal/detal.model";
import { DocumentsUser } from "src/documents/documents-user.model";
import { Documents } from "src/documents/documents.model";
import { Equipment } from "src/equipment/equipment.model";
import { IssueUser } from "src/issue/issue-user.model";
import { Issue } from "src/issue/issue.model";
import { Role } from "src/roles/roles.model";
import * as bcrypt from 'bcryptjs';
import { Cbed } from "src/cbed/cbed.model";
import { Product } from "src/product/product.model";

interface UserCreationAttrs {
    password: string;
    login: string;
    tabel: string;
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
    @Column({type: DataType.STRING, defaultValue: 'ava_defolt.png'})
    image: string;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    rolesId: number;

    @BelongsTo(() => Role)
    role: Role;

    @BelongsToMany(() => Documents, () => DocumentsUser)
    documents: Documents[];
 
    @HasMany(() => Avatars)
    avatars: Avatars[];

    @HasMany(() => Detal)
    detals: Detal[];

    @HasMany(() => Cbed)
    cbeds: Cbed[];

    @HasMany(() => Product)
    products: Product[];

    @HasMany(() => Equipment)
    equipments: Equipment[];

    @HasMany(() => Actions)
    actions: Actions[];

    // Issue 
    @BelongsToMany(() => Issue, () => IssueUser)
    issues: Issue[];

    @HasMany(() => Issue)
    responsibleFor: Issue[];

    
    @AfterSync
    static async checkUser(sync: any) {
        const user = await sync.sequelize.models.User
        const role = await sync.sequelize.models.Role
        if(!user)
            return 

        const hashPassword = await bcrypt.hash('54321', 5);
        const allUser = await user.findAll()
        if(!allUser.length) {
            const admin = await user.create({
                password: hashPassword,
                login: 'Admin.A.A',
                tabel: '001',
                initial: 'Admin Admin Admin'
            })
            // add role 
            if(role && admin) {
                const firstRole = await role.findByPk(1)
                if(firstRole) 
                    user.update({rolesId: firstRole.id}, {where: {id: admin.id}})
                
                
            }
        }
    }

}  