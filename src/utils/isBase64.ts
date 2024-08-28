export function isBase64(str: string): boolean {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return typeof str === 'string' && base64Regex.test(str) && (str.length % 4 === 0);
}