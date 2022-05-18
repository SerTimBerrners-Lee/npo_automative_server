import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Buyer } from 'src/buyer/buyer.model';
import { BuyerService } from 'src/buyer/buyer.service';
import { Cbed } from 'src/cbed/cbed.model';
import { CbedService } from 'src/cbed/cbed.service';
import { Detal } from 'src/detal/detal.model';
import { DetalService } from 'src/detal/detal.service';
import { DocumentsService } from 'src/documents/documents.service';
import { DateMethods } from 'src/files/date.methods';
import { statusShipment } from 'src/files/enums';
import { Product } from 'src/product/product.model';
import { ProductService } from 'src/product/product.service';
import { UpCreateShipmentsDto } from './dto/up-create-shipments.dto';
import { ShComplit } from './sh-complit.model';
import { Shipments } from './shipments.model';

@Injectable()
export class ShipmentsService {
	constructor(@InjectModel(Shipments) private shipmentsReprository: typeof Shipments,	
		private buyerService: BuyerService, 
		private productService: ProductService,
		private cbedService: CbedService,
		private detalService: DetalService,
		private documentsService: DocumentsService) {}

	async createShipments(dto: UpCreateShipmentsDto, files: any) {
		const dm = new DateMethods()
		if (!dto.data) 
			throw new HttpException('Пустое тело запроса', HttpStatus.NO_CONTENT)
		const endShipments = await this.shipmentsReprository.findOne(
			{
				order: [
					['id', 'DESC']
				],
				attributes: ['id'],
				limit: 1
			})
		const endYears = dm.date().split('.')[dm.date().split('.').length - 1].slice(2);
		let numberEndShipments = endShipments && endShipments.id ?  
			`№ ${endYears}-${endShipments.id + 1} от ${dm.date()}` : `№ ${endYears}-1 от ${dm.date()}`

		try {
			const data = JSON.parse(dto.data)
			if(!data) throw new HttpException('Пустой запрос', HttpStatus.NO_CONTENT);
			data.docs = dto.docs;

			let shipment: any;
			if (data.parent_id) {
				const parentShipments = await this.shipmentsReprository.findByPk(data.parent_id, {include: {all: true}})
				if (parentShipments) {
						const pars_number = parentShipments.number_order.split('от');
						numberEndShipments = `${pars_number[0]}/${parentShipments.childrens.length + 1} от ${pars_number[1]}`;

						shipment = await this.shipmentsReprository.create({number_order: numberEndShipments});
						if (!shipment)
							throw new HttpException('Не удалось создать заказ', HttpStatus.BAD_REQUEST);

						shipment.parent_id = data.parent_id;
						await shipment.save();
						return await this.upCreateShipments(data, shipment, files);
				}
			}
			shipment = await this.shipmentsReprository.create({number_order: numberEndShipments});
			if (!shipment)
				throw new HttpException('Не удалось создать заказ', HttpStatus.BAD_REQUEST);

			return await this.upCreateShipments(data, shipment, files);
		} catch (e) {console.error(e)}

	}

	async updateShipments(dto: UpCreateShipmentsDto, files: any) {
		try {
			const data = JSON.parse(dto.data);
			if (!data) throw new HttpException('Пустой запрос', HttpStatus.NO_CONTENT);

			const shipment = await this.shipmentsReprository.findByPk(data.id, {include: {all: true}});
			if (!shipment)
				throw new HttpException('Не удалось найти заказ', HttpStatus.BAD_REQUEST);
			data.docs = dto.docs;
			return await this.upCreateShipments(data, shipment, files);
		} catch(e) {console.error(e)}
	}

	private async upCreateShipments(data: any, shipment: Shipments, files: any) {
		shipment.date_order = data.date_order;
		shipment.date_shipments = data.date_shipments;
		shipment.kol = data.kol;
		shipment.bron = data.bron;
		shipment.base = data.base;
		shipment.to_sklad = data.to_sklad;
		if(data.description != 'null')
			shipment.description = data.description;
			else shipment.description = '';

		if(data.documentsData) {
			try {
				const pars_id_documents = JSON.parse(data.documentsData);	
				for(let doc of pars_id_documents) {
					const docs = await this.documentsService.getFileById(doc);
					if(docs) 
						await shipment.$add('documents', docs.id);;
				}
			} catch(e) {console.error(e)}
		}

		if(data.list_cbed_detal && data.list_cbed_detal != 'null' || data.list_cbed_detal != '[]') {
			try {
				let list_izd = JSON.parse(data.list_cbed_detal)
				if(data.list_hidden_cbed_detal) list_izd = list_izd.concat(JSON.parse(data.list_hidden_cbed_detal))
				for(let izd of list_izd) {
					if(data.id && shipment.list_cbed_detal) {
						let parsCurList = JSON.parse(shipment.list_cbed_detal)
						if(shipment.list_hidden_cbed_detal) parsCurList = parsCurList.concat(JSON.parse(shipment.list_hidden_cbed_detal))
						let check = true
						for(let upl_izd of parsCurList) {
							if(upl_izd.type == izd.type && upl_izd.obj.id == izd.obj.id) {
								if(Number(izd.kol) > Number(upl_izd.kol)) {
									izd.kol = Math.round(Number(izd.kol) - Number(upl_izd.kol));
									continue;
								}
								if(Number(izd.kol) < Number(upl_izd.kol)) izd.kol = Math.round(Number(izd.kol) - Number(upl_izd.kol));
								else check = false;
							}
						}
						if(!check) continue;
					}
					await this.incrementShipmentsKolvo(izd, shipment, 'increment');
				}
				if(shipment.list_cbed_detal) {
					let parsCurList = JSON.parse(shipment.list_cbed_detal);
					if(shipment.list_hidden_cbed_detal) parsCurList = parsCurList.concat(JSON.parse(shipment.list_hidden_cbed_detal));
					for(const izd of parsCurList) {
						let check = false;
						for(let dat_item of list_izd) {
							if(dat_item.type == izd.type && dat_item.obj.id == izd.obj.id) check = true;
						}
						if(!check) await this.incrementShipmentsKolvo(izd, shipment, 'decriment');
						check = false;
					}
				}
				shipment.list_cbed_detal = data.list_cbed_detal
				shipment.list_hidden_cbed_detal = data.list_hidden_cbed_detal
			} catch(e) {console.error(e)}
		} else {
			shipment.list_cbed_detal = '';
			shipment.list_hidden_cbed_detal = '';
		}

		if(data.buyer && Number(data.buyer) && !data.to_sklad) {
			const buyer = await this.buyerService.getByuerById(data.buyer);
			if(buyer) {
				shipment.buyerId = buyer.id;
				await shipment.save();
			}
		}
		if(data.to_sklad) {
			if(shipment.buyerId) shipment.buyerId = null;
			await shipment.save();
		}
		if(data.product && !data.is_not_product) {
			const product = await this.productService.getById(data.product.id);
			if(product) {
				product.shipments_kolvo += Number(data.kol);
				shipment.productId = product.id;
				await product.save();
				await shipment.save();
			}
		}

		if(data.docs, files.document) {
			if(typeof data.docs == 'object' && data.docs?.length) 
				data.docs = JSON.stringify(data.docs.map((el: any) => JSON.parse(el)));

			await this.documentsService.attachDocumentForObject(shipment, data, files);
		}

		await shipment.save();
		return shipment;
	}

	async deleteShipmentsById(id:number) {
		const shipments = await this.shipmentsReprository.findByPk(id);
		if(!shipments) 
			throw new HttpException('Не удалось найти задачу', HttpStatus.NOT_FOUND);

		if(!shipments.ban) {
			shipments.ban = true;
			shipments.status = statusShipment.ban;
			await shipments.save();
			return shipments.id;
		}

		if(shipments.list_cbed_detal) {
			try {
				let pars = JSON.parse(shipments.list_cbed_detal)
				if(shipments.list_hidden_cbed_detal) pars = pars.concat(JSON.parse(shipments.list_hidden_cbed_detal))
				if(pars) {
					for(let izd of pars) {
						this.incrementShipmentsKolvo(izd, shipments, 'decriment')
					}
				}
			} catch(e) {console.error(e)}
		}
		if(shipments.productId) shipments.productId = null
		await shipments.save()
		const result = await this.shipmentsReprository.destroy({where: {id: shipments.id}})

		return result;
	}

	/**
	 * Меняем количество заказаных СБ и Д
	 * @param izd 
	 * @param shipment 
	 * @param action 
	 */
	private async incrementShipmentsKolvo(izd: any, shipment: Shipments, action: string) {
		if(izd.type == 'cbed') {
			let izdels = await this.cbedService.findById(izd.obj.id, 'true') 
			if(izdels) {
				if(action == 'increment') shipment.$add('cbeds', izdels.id)
				else shipment.$remove('cbeds', izdels.id)
				
				await izdels.save();
			}
		} else if(izd.type == 'detal') {
				let izdels = await this.detalService.findByIdDetal(izd.obj.id, 'true')
				if(izdels) {
					if(action == 'increment') shipment.$add('detals', izdels.id)
					else shipment.$remove('detals', izdels.id)

					await izdels.save();
				}
		}
	}

	async getAllShipments(light: string = 'false') {
		if(light == 'false') return await this.shipmentsReprository.findAll({include: { all: true }});
		if(light == 'true') return await this.shipmentsReprository.findAll({ attributes: ['id', 'number_order', 'date_shipments'], where: { status: {
			[Op.not]: statusShipment.done
		}} });
	}

	async getAllShipmentsNoStatus(status: number = 2) {
		let folder: string = 'done';

		if (status == 0) folder = 'order';
		if (status == 1) folder = 'ban';
		if (status == 2) folder = 'done';
		if (status == 3) folder = 'overbue';

		const shipments = await this.shipmentsReprository.findAll({ attributes: ['id', 'number_order', 'date_shipments'], 
			where: {
				status: {
					[Op.not]: statusShipment[folder]
				}
			}
		});
		console.log(shipments, folder);
		if (!shipments) throw new HttpException('Не удалось получить заказы', HttpStatus.BAD_GATEWAY);

		return shipments;
	}

	async getShipmentsIzd(id: number) {
		return await this.shipmentsReprository.findByPk(id, {
			include: [
				{ model: Detal },
				{ model: Cbed },
				{ model: Product }
			]
		});
	}

	async getAllShipmentsTo() {
		const shipments = await this.shipmentsReprository.findAll({include: [
		{
			model: Product,
			attributes: ['name', 'id', 'articl', 'fabricNumber']
		},
		{
			model: Buyer,
			attributes: ['name']
		},
		{ model: ShComplit, attributes: ['date_shipments_fakt', 'id'] },
		]});

		return shipments;
	}

	async getAllShipmentsSclad(to_sclad: boolean) {
		const result =  await this.shipmentsReprository.findAll({where: {to_sklad: to_sclad}, 
			include: [
				{ all: true },
				{ model: ShComplit, attributes: ['date_shipments_fakt', 'id'] }]});
		return result;
	}

	async changeShipmentToSclad(id: number) {
		const shipments = await this.shipmentsReprository.findByPk(id);
		if(shipments) {
			shipments.to_sklad = !shipments.to_sklad
			await shipments.save()
			return shipments;
		}
	}

	async returnDoucments(id: number) {
		const documents = await this.shipmentsReprository.findByPk(id, {include: ['documents'], attributes: ['id']});
		return documents;
	}

	async getById(id: number, light = 'false') {
		if(light == 'false') return await this.shipmentsReprository.findByPk(id, {include: {all: true}})
		return await this.shipmentsReprository.findByPk(id)
	}

	async getAllShipmentsAssemble(light: string = 'false') {
		const shipments = await this.shipmentsReprository.findAll({
			include: [
				light == 'false' ? {all: true} :
				'cbeds'
			],
			where: {
				status: {
					[Op.not]: statusShipment.done
				}
			},
			attributes: light ? ['id', 'number_order', 'date_shipments'] : { exclude: ['updatedAt', 'createdAt']}
		})
		const assemble: any = []
		for(let sh of shipments) {
			if(sh.cbeds && sh.cbeds.length) assemble.push(sh)
		}
		
		return assemble;
	}

	async getAllShipmentsMetaloworking(light: string = 'false') {
		const shipments = await this.shipmentsReprository.findAll({
			include: [
				light == 'false' ? {all: true} :
				'detals'
			],
			where: {
				status: {
					[Op.not]: statusShipment.done
				}
			},
			attributes: light ? ['id', 'number_order', 'date_shipments'] : { exclude: ['updatedAt', 'createdAt']}
		})
		const metaloworking: any = []
		for(let sh of shipments) {
			if(sh.detals && sh.detals.length) metaloworking.push(sh)
		}

		if(light == 'true') {
			for(let sh of metaloworking) {
				delete sh['detals']
			}
		}
		return metaloworking;
	}

	async getAllShipmentsById(id: number, light: string = 'false') {
		if(light == 'false') return await this.shipmentsReprository.findByPk(id, {include:[
			{all: true},
			{
				model: Cbed, 
				include: ['shipments']
			},
			{
				model: Detal, 
				include: ['shipments']
			},
			{ model: ShComplit, attributes: ['date_shipments_fakt', 'id'] },
		]})

		return await this.shipmentsReprository.findByPk(id, {include: [
			{
				model: Buyer,
				attributes: ['id', 'name']
			},
			{
				model: Product,
				attributes: ['id', 'name', 'articl', 'fabricNumber']
			},
			{ model: ShComplit, attributes: ['date_shipments_fakt', 'id'] },
			'documents'
		]})
	}

	async getAtributeModelSh(id: number, dto: any) {
		console.log(id, dto, '\n\n\n')
	}

	async getIncludeModelSh(id: number, dto: any) {
		if (!dto.includes || !dto.includes.length)
			throw new HttpException('Пераеданы пустые поля', HttpStatus.BAD_REQUEST);

		let include: any = [];
		let attributes: any;
		let is_childrens: boolean = false;
		
		for (const folder of dto.includes) {
			if (folder == 'childrens') {
				is_childrens = true;
				include.pust({
						model: Shipments,
						include: [
							{ model: Product, attributes: ['id', 'name', 'articl', 'fabricNumber'] },
							{ model: Buyer, attributes: ['id', 'name'] },
							{ model: ShComplit, attributes: ['date_shipments_fakt', 'id'] },
							'documents'
						],
					})
				include.pust({ model: Product, attributes: ['id', 'name', 'articl'] })
				include.pust({ model: Buyer, attributes: ['id', 'name'] })
				include.pust({ model: ShComplit, attributes: ['date_shipments_fakt', 'id'] })
				include.pust('documents');
			} else {
				include.push(folder);
				attributes = ['id'];
			};
		}

		let sh: any = await this.shipmentsReprository.findByPk(id, {include, attributes});
		if (!sh) throw new HttpException('Не удалось найти задачу или само поле к задаче', HttpStatus.BAD_GATEWAY);

		if (is_childrens && sh.childrens) {
			const maps: any = sh.toJSON();
			sh = sh.toJSON();
			delete maps.childrens;
			sh.childrens.push(maps);
		}

		return sh;
	}

	async updateStatus(shipments: Array<Shipments>, new_status: string) {
		for(let item of shipments) {
			if(item.ban) continue;
			item.status = new_status;

			await item.save();
		}
	}

}
