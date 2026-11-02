import crypto from 'crypto';

function calculateNodeHmac(secret, body) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

async function calculateWebCryptoHmac(secret, body) {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function testHmac() {
  const orderId = 'order_M123456';
  const payId = 'pay_P123456';
  const secret = 'En2deSecret123';
  const payload = `${orderId}|${payId}`;

  const nodeSig = calculateNodeHmac(secret, payload);
  const webSig = await calculateWebCryptoHmac(secret, payload);

  console.log('Node HMAC:      ', nodeSig);
  console.log('WebCrypto HMAC: ', webSig);
  console.log('Match:          ', nodeSig === webSig ? '✅ MATCH' : '❌ MISMATCH');
}

testHmac();
