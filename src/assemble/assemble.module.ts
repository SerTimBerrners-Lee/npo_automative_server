import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CbedModule } from 'src/cbed/cbed.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { AssembleController } from './assemble.controller';
import { Assemble } from './assemble.model';
import { AssembleService } from './assemble.service';

@Module({
	controllers: [AssembleController],
	providers: [AssembleService],
	imports: [
		SequelizeModule.forFeature([
			Assemble
		]),
		ShipmentsModule,
		CbedModule
],
	exports: [AssembleService]
})
export class AssembleModule {}
