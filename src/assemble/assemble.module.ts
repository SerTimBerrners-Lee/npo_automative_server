import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CbedModule } from 'src/cbed/cbed.module';
import { DetalModule } from 'src/detal/detal.module';
import { MetaloworkingModule } from 'src/metaloworking/metaloworking.module';
import { ProductModule } from 'src/product/product.module';
import { SettingsModule } from 'src/settings/settings.module';
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
		CbedModule,
		SettingsModule,
		DetalModule,
		MetaloworkingModule,
		ProductModule
],
	exports: [AssembleService]
})
export class AssembleModule {}
