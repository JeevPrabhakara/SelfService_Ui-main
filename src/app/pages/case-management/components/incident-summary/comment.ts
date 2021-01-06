export class Comment {

    constructor(
        public comment: string,
        public incID: number,
        public parentcmtID: number,
        public taggedUserIds: any
    ) {
    }
}

