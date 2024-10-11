import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";

export type TStatusLiquidation = "thanh lý" | "hư hỏng"
export type TPositionLiquidation = "trên kệ" | "trong kho"

export type TLiquidation = TEntityAbstract & {
    note?: string,
    publicationId: TPublications | string,
    reason?: string,
    quantity: number,
    status: TStatusLiquidation,
    position: TPositionLiquidation,
};

export type TLiquidationCreate = Partial<Pick<TLiquidation, "note" | "reason" | "quantity" | "status" | "position">>& {
    publicationId: TPublications | string,
};
export type TLiquidationEdit = Partial<Pick<TLiquidation, "note" | "reason" | "quantity" | "status" | "position">> & {
    _id: string;
    publicationId: TPublications | string,
};