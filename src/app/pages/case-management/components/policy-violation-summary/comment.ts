export class Comment {

    constructor(
        public comment: string,
        public pvID: number,
        public parentcmtID: number,
        public taggedUserIds: any
    ) {
    }
}

