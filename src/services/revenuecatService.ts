import { Purchases } from '@revenuecat/purchases-capacitor';

export const REVENUECAT_API_KEY = 'appl_KOjWxMCuhPxHiktdodYApTkUQuY';
export const PRODUCT_ID_PRO = 'com.findmycar.parkedlocation.pro';

export class RevenueCatService {
  private isInitialized = false;

  /**
   * Initialize RevenueCat SDK with Production API Key
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      if (typeof window !== 'undefined') {
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        this.isInitialized = true;
        console.log("RevenueCat SDK initialized successfully with key:", REVENUECAT_API_KEY);
      }
    } catch (err) {
      console.warn("RevenueCat init fallback:", err);
    }
  }

  /**
   * Check if user has active Pro entitlement
   */
  public async checkProStatus(): Promise<boolean> {
    try {
      await this.init();
      const customerInfo = await Purchases.getCustomerInfo();
      const isProActive =
        Boolean(customerInfo.customerInfo.entitlements.active['pro']) ||
        Boolean(customerInfo.customerInfo.entitlements.active['lifetime']) ||
        Boolean(customerInfo.customerInfo.allPurchasedProductIdentifiers.includes(PRODUCT_ID_PRO));
      return isProActive;
    } catch (err) {
      console.warn("RevenueCat checkProStatus fallback:", err);
      return false;
    }
  }

  /**
   * Purchase Lifetime Pro $3.99 In-App Purchase
   */
  public async purchasePro(): Promise<boolean> {
    try {
      await this.init();
      const products = await Purchases.getProducts({ productIdentifiers: [PRODUCT_ID_PRO] });
      if (products.products.length > 0) {
        const purchaseResult = await Purchases.purchaseStoreProduct({
          product: products.products[0],
        });
        const isProActive =
          Boolean(purchaseResult.customerInfo.entitlements.active['pro']) ||
          Boolean(purchaseResult.customerInfo.entitlements.active['lifetime']) ||
          Boolean(purchaseResult.customerInfo.allPurchasedProductIdentifiers.includes(PRODUCT_ID_PRO));
        return isProActive;
      }
      return false;
    } catch (err: unknown) {
      console.warn("RevenueCat purchasePro error:", err);
      return false;
    }
  }

  /**
   * Restore Purchases
   */
  public async restorePurchases(): Promise<boolean> {
    try {
      await this.init();
      const customerInfo = await Purchases.restorePurchases();
      const isProActive =
        Boolean(customerInfo.customerInfo.entitlements.active['pro']) ||
        Boolean(customerInfo.customerInfo.entitlements.active['lifetime']) ||
        Boolean(customerInfo.customerInfo.allPurchasedProductIdentifiers.includes(PRODUCT_ID_PRO));
      return isProActive;
    } catch (err) {
      console.warn("RevenueCat restorePurchases error:", err);
      return false;
    }
  }
}

export const revenueCatService = new RevenueCatService();
