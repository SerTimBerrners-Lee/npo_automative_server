import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { DocumentsLinks } from "src/documents/documents-links.model";
import { Documents } from "src/documents/documents.model";
import { User } from "src/users/users.model";
import { Chapter } from "./chapter.model";

interface LinksCreationAttrs {
    name: string;
}

@Table({tableName: 'links'})
export class Links extends Model<Links, LinksCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '', description: 'Имя'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;   

    @ApiProperty({example: true, description: 'Адресс ссылки '})
    @Column({type: DataType.STRING})
    link: string; 

    @ApiProperty({example: false, description: 'Ссылка'})
    @Column({type: DataType.BOOLEAN})
    is_link: boolean; 

    @ApiProperty({example: false, description: 'Бан'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    ban: boolean; 

    @ApiProperty({example: '', description: 'Описание'})
    @Column({type: DataType.STRING})
    description: string; 

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    responsible_id: number;

    @BelongsTo(() => User)
    user: User; 

    @ForeignKey(() => Chapter)
    @Column({type: DataType.INTEGER})
    chapter_id: number;

    @BelongsTo(() => Chapter)
    chapter: Chapter; 

    @BelongsToMany(() => Documents, () => DocumentsLinks)
    documents: Documents[];

}     