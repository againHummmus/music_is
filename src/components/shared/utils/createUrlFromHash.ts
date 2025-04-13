export const createImgUrl = (hash: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/img/${hash}`;
}

export const createMp3Url = (hash: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}/mp3/${hash}`;
}
