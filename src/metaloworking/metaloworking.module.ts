import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DetalModule } from 'src/detal/detal.module';
import { ProductModule } from 'src/product/product.module';
import { SettingsModule } from 'src/settings/settings.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { MetaloworkingController } from './metaloworking.controller';
import { Metaloworking } from './metaloworking.model';
import { MetaloworkingService } from './metaloworking.service';

@Module({
	controllers: [MetaloworkingController],
	providers: [MetaloworkingService],
	imports: [
		SequelizeModule.forFeature([
			Metaloworking
		]),
		forwardRef(() => ShipmentsModule),
		DetalModule,
		SettingsModule,
		ProductModule
],
	exports: [MetaloworkingService]
})
export class MetaloworkingModule {}
