
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
}
