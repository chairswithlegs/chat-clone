import { SearchFilterPipe } from './search-filter.pipe';

describe('SearchFilterPipe', () => {
	let pipe;

	beforeEach(() => {
		pipe = new SearchFilterPipe();
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should implement the PipeTransform interface', () => {
		expect(pipe.transform).toBeTruthy();
	});

	it('should filter the search string', () => {
		const input = ['value1', 'value2', 'anothervalue1'];
		const inputWithChildren = [{
			value: 'value1'
		}, {
			value: 'value2'
		}];

		let output = pipe.transform(input, 'value');
		expect(output.length).toBe(3);

		output = pipe.transform(input, '1');
		expect(output.length).toBe(2);

		output = pipe.transform(inputWithChildren, 'value', 'value');
		expect(output.length).toBe(2);

		output = pipe.transform(input, 'value', undefined, 1);
		expect(output.length).toBe(1);
	});
});
