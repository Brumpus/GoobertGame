declare const __APP_BASE_PATH__: string;

export function assetPath(path: string): string {
    return `${__APP_BASE_PATH__}${path.replace(/^\/+/, "")}`;
}