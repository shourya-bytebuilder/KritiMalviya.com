// =============================================================================
// PHONEPE PAYMENT GATEWAY INTEGRATION MODULE (PG V1 SPECIFICATION)
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// =============================================================================

export interface PhonePeConfig {
  merchantId: string;
  saltKey: string;
  saltIndex: string;
  environment: "UAT" | "LIVE";
  baseUrl: string;
}

export function getPhonePeConfig(): PhonePeConfig {
  const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID") || "PGTESTPAYUAT";
  const saltKey = Deno.env.get("PHONEPE_SALT_KEY") || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") || "1";
  const envRaw = (Deno.env.get("PHONEPE_ENVIRONMENT") || "UAT").toUpperCase();
  const environment: "UAT" | "LIVE" = envRaw === "LIVE" || envRaw === "PRODUCTION" ? "LIVE" : "UAT";

  const baseUrl = environment === "LIVE"
    ? "https://api.phonepe.com/apis/hermes"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

  return {
    merchantId,
    saltKey,
    saltIndex,
    environment,
    baseUrl
  };
}

/**
 * Computes SHA-256 Hex Hash in Deno Web Crypto API
 */
export async function sha256Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Initiates PhonePe Standard Pay Request (/pg/v1/pay)
 */
export async function initiatePaymentWithPhonePe(params: {
  merchantTransactionId: string;
  merchantUserId: string;
  amountPaise: number; // Integer in Paise (100 Paise = ₹1)
  redirectUrl: string;
  callbackUrl?: string;
  mobileNumber?: string;
  config: PhonePeConfig;
}): Promise<{
  success: boolean;
  redirectUrl: string;
  phonePeTransactionId?: string;
  rawResponse?: unknown;
  error?: string;
}> {
  const { config, merchantTransactionId, merchantUserId, amountPaise, redirectUrl, callbackUrl, mobileNumber } = params;

  // 1. Construct PhonePe standard payload
  const payloadObj = {
    merchantId: config.merchantId,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: merchantUserId,
    amount: amountPaise,
    redirectUrl: redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: callbackUrl || redirectUrl,
    mobileNumber: mobileNumber ? mobileNumber.replace(/\D/g, "").slice(-10) : undefined,
    paymentInstrument: {
      type: "PAY_PAGE"
    }
  };

  const jsonStr = JSON.stringify(payloadObj);
  const base64Payload = btoa(jsonStr);

  // 2. Generate Checksum: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
  const stringToSign = `${base64Payload}/pg/v1/pay${config.saltKey}`;
  const sha256Checksum = await sha256Hex(stringToSign);
  const xVerifyHeader = `${sha256Checksum}###${config.saltIndex}`;

  try {
    const response = await fetch(`${config.baseUrl}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyHeader
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const resData = await response.json();

    if (resData.success && resData.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        redirectUrl: resData.data.instrumentResponse.redirectInfo.url,
        phonePeTransactionId: resData.data.merchantTransactionId || merchantTransactionId,
        rawResponse: {
          code: resData.code,
          message: resData.message
        }
      };
    } else {
      // In sandbox / test if gateway rejected test payload or test credentials require fallback
      return {
        success: false,
        redirectUrl: "",
        error: resData.message || resData.code || "PhonePe pay initiation failed",
        rawResponse: resData
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      redirectUrl: "",
      error: `Network error connecting to PhonePe: ${errorMsg}`
    };
  }
}

/**
 * Checks Transaction Status from PhonePe Server-Side Status API (/pg/v1/status/{merchantId}/{merchantTransactionId})
 */
export async function checkPhonePeStatus(params: {
  merchantTransactionId: string;
  config: PhonePeConfig;
}): Promise<{
  success: boolean;
  status: "PAID" | "FAILED" | "PENDING" | "UNKNOWN";
  gatewayTransactionId?: string;
  amountPaise?: number;
  rawResponse?: unknown;
  error?: string;
}> {
  const { config, merchantTransactionId } = params;

  // Endpoint: /pg/v1/status/{merchantId}/{merchantTransactionId}
  const endpoint = `/pg/v1/status/${config.merchantId}/${merchantTransactionId}`;
  const stringToSign = `${endpoint}${config.saltKey}`;
  const sha256Checksum = await sha256Hex(stringToSign);
  const xVerifyHeader = `${sha256Checksum}###${config.saltIndex}`;

  try {
    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyHeader,
        "X-MERCHANT-ID": config.merchantId
      }
    });

    const resData = await response.json();

    if (resData.code === "PAYMENT_SUCCESS" && resData.data?.state === "COMPLETED") {
      return {
        success: true,
        status: "PAID",
        gatewayTransactionId: resData.data.transactionId,
        amountPaise: resData.data.amount,
        rawResponse: {
          code: resData.code,
          state: resData.data.state,
          responseCode: resData.data.responseCode
        }
      };
    } else if (resData.code === "PAYMENT_ERROR" || resData.code === "PAYMENT_DECLINED" || resData.data?.state === "FAILED") {
      return {
        success: false,
        status: "FAILED",
        gatewayTransactionId: resData.data?.transactionId,
        amountPaise: resData.data?.amount,
        rawResponse: {
          code: resData.code,
          message: resData.message
        }
      };
    } else if (resData.code === "PAYMENT_PENDING" || resData.data?.state === "PENDING") {
      return {
        success: true,
        status: "PENDING",
        gatewayTransactionId: resData.data?.transactionId,
        amountPaise: resData.data?.amount,
        rawResponse: {
          code: resData.code,
          message: resData.message
        }
      };
    } else {
      return {
        success: false,
        status: "UNKNOWN",
        error: resData.message || resData.code || "Uncertain payment status from gateway",
        rawResponse: resData
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: "UNKNOWN",
      error: `Network timeout connecting to PhonePe Status API: ${errorMsg}`
    };
  }
}

/**
 * Validates incoming Webhook Signature from PhonePe
 */
export async function verifyWebhookSignature(
  base64Response: string,
  receivedXVerify: string,
  config: PhonePeConfig
): Promise<boolean> {
  if (!base64Response || !receivedXVerify) return false;
  const stringToSign = `${base64Response}${config.saltKey}`;
  const computedHash = await sha256Hex(stringToSign);
  const expectedVerify = `${computedHash}###${config.saltIndex}`;
  return receivedXVerify === expectedVerify;
}
