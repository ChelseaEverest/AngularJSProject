export interface Course {
    subjectCodes: Array<{
        className: string,
        subject: string,
        courseInfo?: Array<{
            courseCode: number,
            component: string,
            startTime: string,
            endTime: string,
            days: string
      }>
    }>
  }