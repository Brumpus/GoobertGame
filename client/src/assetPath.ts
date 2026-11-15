declare const __APP_BASE_PATH__: string;

/*=====ASSET PATHS=====*/

// A leading slash is essential for nested routes such as /games/dungeon-dash.
// In production, __APP_BASE_PATH__ includes the deployment subdirectory.
export function assetPath(path: string): string {
    const base = __APP_BASE_PATH__.replace(/\/+$/, "");
    const relativePath = path.replace(/^\/+/, "");
    return `${base}/${relativePath}`;
}
