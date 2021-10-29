
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


	// var now = new Date();
	// var mi = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
	// if (mi < 0) 
	// 		mi += 86400000; 
	// setTimeout(() => console.log("10am!"), mi);
}
