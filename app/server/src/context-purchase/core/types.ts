type Flower = {
  id: number;
  flowerCode: string;
  name: string;
  deliveryDays: number;
  purchaseQuantity: number;
  maintanableDays: number;
};

/**
 * 仕入れ明細
 */
export type PurchaseDetail = {
  flower: Flower;
  orderQuantity: number;
};

/**
 * 仕入れ
 */
export type Purchase = {
  deliveryDate: Date;
  purchaseDetails: PurchaseDetail[];
};

export type CreatedPurchase = Purchase & {
  id: number;
};
