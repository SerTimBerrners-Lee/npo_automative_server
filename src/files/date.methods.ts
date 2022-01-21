
export class DateMethods {
	constructor() {
		this.dt = new Date()
		this.hours = this.dt.getUTCHours() + 3;
		this.minute = this.dt.getMinutes().toString().length == 1 ? '0' + this.dt.getMinutes() : this.dt.getMinutes();
		this.seconds = this.dt.getSeconds().toString().length == 1 ? '0' + this.dt.getSeconds() : this.dt.getSeconds();
	}

	public dt: any;
	public hours: any;
	public minute: any;
	public seconds: any;

	public date = () => this.dt.toISOString().slice(0,10).split('-').reverse().join('.')

	public time = () => `${this.hours}:${this.minute}:${this.seconds}`;

	// Сравнение дат
	public comparison = (one_date: string = new Date().toLocaleDateString('ru-RU'), two_date: string = new Date().toLocaleDateString('ru-RU'), operation: string = '==') => {
		let d1 = utfDate(one_date)
		let d2 = utfDate(two_date)

		function utfDate(d: string): string {
			let ds = d.split('.').reverse().join('-') + 'T10:10:10Z'
			return ds
		}

		let result: boolean
		switch(operation) {
			case '==':
				result = Date.parse(d1) == Date.parse(d2)
				break
			case '<':
				result = Date.parse(d1) < Date.parse(d2)
				break
			case '>':
				result = Date.parse(d1) > Date.parse(d2)
				break
			case '<=':
				result = Date.parse(d1) <= Date.parse(d2)
				break
			case '>=':
				result = Date.parse(d1) >= Date.parse(d2)
				break
			case '!=':
				result = Date.parse(d1) != Date.parse(d2)
				break
		}

		return result

	}

	public dateDifference = (date_one = new Date().toLocaleString('ru-RU').split(',')[0], date_two: string) => {
		if(!date_two) return 0
		const toFormatString = (date: any) => {
			const spl = date.split('.')
			return `${spl[2]}-${spl[1]}-${spl[0]}T10:20:30Z`
		}
	
		let date1 = new Date(toFormatString(date_one));
		let date2 = new Date(toFormatString(date_two));
		const mat = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
		return date2.getTime() < date1.getTime() ? -mat: mat
	}
}
