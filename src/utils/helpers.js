export function getUsernameFromEmail(email: string) {
    return email.substring(0, email.indexOf('@'));
}