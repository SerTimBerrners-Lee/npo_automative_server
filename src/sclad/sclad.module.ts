import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Deficit } from './deficit.model';
import { ScladController } from './sclad.controller';
import { ScladService } from './sclad.service';

@Module({
    controllers: [ScladController],
    providers: [ScladService],
    imports: [
        SequelizeModule.forFeature([
            Deficit
        ])
    ],
    exports: [ScladModule]
})
export class ScladModule {}
