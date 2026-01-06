export async function generatePKCECodes() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  const code_verifier = btoa(
    Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join(""),
  );

  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  const code_challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return { code_verifier, code_challenge };
}
