import 'dotenv/config';

export enum StatusAssemble {
  performed = 'В процессе',
  done = 'Готово',
  ban = 'В архиве',
  overbue = 'Просрочено' 
}

export enum StatusMetaloworking {
  performed = 'В процессе',
  done = 'Готово',
  ban = 'В архиве',
  overbue = 'Просрочено' 
}

export enum statusShipment {
	order = 'Заказано',
	ban = 'Удалено',
	performed = 'Выполняется',
	done = 'Отгружено',
  overbue = 'Просрочено' 
}

export enum statusDelivery {
  'Заказано',
  'Доставлено',
  'Отгружено'
}

export const EZ_KOLVO = '{"c1_kolvo":{"material_kolvo":0,"shipments_kolvo":0,"min_remaining":0,"price":0, "deliveries_kolvo":0},"c2_kolvo":{"material_kolvo":0,"shipments_kolvo":0,"min_remaining":0,"price":0, "deliveries_kolvo":0},"c3_kolvo":{"material_kolvo":0,"shipments_kolvo":0,"min_remaining":0,"price":0, "deliveries_kolvo":0},"c4_kolvo":{"material_kolvo":0,"shipments_kolvo":0,"min_remaining":0,"price":0, "deliveries_kolvo":0},"c5_kolvo":{"material_kolvo":0,"shipments_kolvo":0,"min_remaining":0,"price":0, "deliveries_kolvo":0}}';

export const KOLVO = '{"c1":true,"c2":false,"c3":false,"c4":false,"c5":false}';

export const HOME_DIR = `${process.env.PWD}/`;
export const PUBLIC_DIR = `${HOME_DIR}dist/static/public/`;
export const STATIC_DIR = `${HOME_DIR}dist/static/`;

export enum WorkingType {
  ass = "ass",
  metall = "metall"
}
