export interface Book {
    id: string;
    name: string;
    author: string;
    pdfUrl: string;
    coverUrl?: string;
    description?: string;
    addedAt?: any;
}