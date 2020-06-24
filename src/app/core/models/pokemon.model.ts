export class Pokemon {
	constructor(
		public id: number,
		public name: string,
		public picurl: string,
		public types: string[],
		public height: number,
		public weight: number,
		public movements: string[]
	) {
		if (!(this.picurl || '').trim()) {
			this.picurl = 'assets/unknown.jpg';
		}
	}
}

export interface PokeapiData {
	count: number;
	results: Pokemon[];
}
