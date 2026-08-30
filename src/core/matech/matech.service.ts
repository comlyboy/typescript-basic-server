import { apiResult } from "@incloodsolutions/node-toolkit";
import { sendHttpRequest } from "@incloodsolutions/toolkit";
import { MatechDatabaseEnum } from "../../constants";
import { log } from "console";

import { parse } from 'csv-parse/sync';
import { IProduct } from "./matech.interface";


export class MatechService {

	async getProducts() {
		const url = `https://docs.google.com/spreadsheets/d/10c1VeUZZKynvlve6O5vEqcIY3V1nVUeRTGawc4AtQxw/export?format=csv&gid=${MatechDatabaseEnum.PRODUCT}`;
		// const url = `https://docs.google.com/spreadsheets/d/10c1VeUZZKynvlve6O5vEqcIY3V1nVUeRTGawc4AtQxw/gviz/tq?tqx=out:csv&gid=${MatechDatabaseEnum.PRODUCT}`;

		const productsCsv = await sendHttpRequest({ url });
		console.log('productsCsv', productsCsv);

		const products = parse<IProduct>(productsCsv, {
			columns: true,
			skip_empty_lines: true,
			trim: true,
			autoParse: true
		});

		log('products', products);

		return apiResult({ message: 'success', data: { products } });
	}

}
