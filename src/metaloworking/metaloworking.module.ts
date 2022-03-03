import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { DetalModule } from 'src/detal/detal.module';
import { FilesModule } from 'src/files/files.module';
import { ProductModule } from 'src/product/product.module';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
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
			Metaloworking,
			Detal,
			PodPodMaterial
		]),
		forwardRef(()=> ShipmentsModule),
		DetalModule,
		SettingsModule,
		ProductModule,
		FilesModule,
],
	exports: [MetaloworkingService]
})
export class MetaloworkingModule {}
