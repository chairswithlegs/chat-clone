import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

	transform(items: any[], searchString: string, filterProperty?: string, maxResults?: number): any {
		//If the list is empty or no search string is given, don't bother filtering
		if (!items || !searchString) {
			return [];
		}

		//Makes the search case insensitive
		searchString = searchString.toLowerCase();

		//Filter the items, optionally indexing on a property
		let results;
		if (filterProperty) {
			results = items.filter((item, index) => item[filterProperty].toLowerCase().includes(searchString));
		} else {
			results = items.filter((item) => item.toLowerCase().includes(searchString));
		}

		//Optionally limit the number of results
		if (maxResults) {
			results = results.slice(0, maxResults);
		}

		return results;
	}

}
