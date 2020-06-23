export class Pokemon {
	constructor(
		public id: number,
		public name: string,
		public picurl: string,
		public types: string[],
		public height: number,
		public weight: number,
		public movements: string[]
	) {}
}
