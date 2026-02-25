import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ProductId = bigint;
export type Time = bigint;
export type InquiryId = bigint;
export interface FabricProduct {
    id: ProductId;
    minOrderQuantity: bigint;
    weightGSM: bigint;
    fabricType: string;
    widthCM: bigint;
    name: string;
    color: string;
    imageFilename: string;
    description: string;
    pricePerMeter: number;
}
export interface CustomerInquiry {
    id: InquiryId;
    customerName: string;
    productId: ProductId;
    email: string;
    message: string;
    timestamp: Time;
    companyName?: string;
    phone: string;
    quantityRequired: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, fabricType: string, color: string, weightGSM: bigint, widthCM: bigint, minOrderQuantity: bigint, pricePerMeter: number, imageFilename: string): Promise<ProductId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllInquiries(): Promise<Array<CustomerInquiry>>;
    getAllProducts(): Promise<Array<FabricProduct>>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: ProductId): Promise<FabricProduct>;
    initializeSampleProducts(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    submitInquiry(customerName: string, email: string, phone: string, companyName: string | null, productId: ProductId, quantityRequired: bigint, message: string): Promise<InquiryId>;
}
