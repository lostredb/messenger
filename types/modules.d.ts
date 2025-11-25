declare module '*.css' {
    const content: {[className: string]: string}
    export default content
}

declare module 'mime-types' {
    export function lookup(path: string): string | false
    export function contentType(type: string): string | false
    export function extension(type: string): string | false
    export function charset(type: string): string | false
}