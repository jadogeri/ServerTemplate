export type Mail = {
    to: string;
    html: string;
    from: string;
    text: string;   
    subject: string;
    deeplink?: string | null
}

