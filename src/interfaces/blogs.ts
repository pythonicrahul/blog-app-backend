export interface IBlogCreationRequest {
    title: string;
    content: string;
}

export interface IBlogUpdateRequest {
    title?: string;
    content?: string;
}

export interface IBlogQuery {
    title?: any;
    id ?: string;
    author ?: string;
    latest ?: boolean;
}