import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, HasMany, BeforeCreate, AfterCreate, AfterSync } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface RoleCreationAttrs {
    value: string;
    description: string;
}

@Table({tableName: 'roles', createdAt: false, updatedAt: false})
export class Role extends Model<Role, RoleCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Значение роли пользователя'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;    

    @ApiProperty({example: 'Директор', description: 'Описание роли пользователя '})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example: '{}', description: 'Разрешения'})
    @Column({type: DataType.TEXT, allowNull: true})
    assets: string;

    @HasMany(() => User)
    user: User[];

    @AfterCreate
    static async createRole(role: any) {
        role.assets = JSON.stringify({
            product: true,
            workResult: true,
            linrary: true,
            issue: true,
            baseCbed: true,
            baseDetal: true,
            baseMaterial: true,
            baseTools: true,
            baseEquipment: true,
            baseTech: true,
            baseProvider: true,
            baseBuyer: true,
            baseFile: true,
            issueShipments: true,
            sclad: true,
            metalloworking: true,
            assembly: true,
            brak: true,
            trash: true,
            writeOff: true,
            raport: true,
            complaint:true,
            archive: true,
            spare: true,

            productAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            cbedAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            detalAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            materialAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            equipmentAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            instrumentAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            providerAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            buyerAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            basefileAssets: {
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            userWorkingAssets: {
                myIssue: true,
                planOperation: true,
                resultWork: true,
                library: true,
            },
            costPriceAssets: {
                read: true
            },
            usersListAssets: {
                hideUserData: false,
                read: true,
                writeYour: true,
                writeSomeone: true
            },
            techProcessAssets: {
                zag: true,
                tok: true,
                sles: true,
                termo: true,
                hrezer: true
            },
            settingsAssets: {
                read: true,
                edit: true,
                users: true,
                edizm: true,
                baseMat: true,
                basePokDet: true,
                baseRash: true,
                operation: true,
                baseTools: true,
                baseEquipment: true,
                baseTech: true,
                deficit: true,
                workTime: true,
                rols: true,
                dolzn: true,
                library: true,
                priceHors: true,
                baseData: true
            }
        })

        await role.save()
    }

    @AfterSync
    static async checkRole(sync: any) {
        const role = await sync.sequelize.models.Role
        if(!role)
            return 

        const allRole = await role.findAll()
        if(!allRole.length) {
            await role.create({value: 'admin', description: 'Администратор'})
        }
    }
}     