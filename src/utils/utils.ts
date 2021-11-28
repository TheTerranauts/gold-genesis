export async function delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const chunk = (arr: any[], size: number) =>
    Array.from({length: Math.ceil(arr.length / size)}, (_: any, i: number) =>
        arr.slice(i * size, i * size + size)
    );
