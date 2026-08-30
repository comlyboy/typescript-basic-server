import { IBaseAmount, IBaseDescription, IBaseId, IBaseName } from "@incloodsolutions/toolkit";

export interface IProduct extends IBaseId, IBaseName, IBaseDescription, IBaseAmount {
	imageUrl: string;
}