export interface Schedule {
    scheduleName:string,
    codes:Array<{
      subjectCode:string,
      courseCode:string
        }>
  }
export interface UpdateSchedule {
    subjectCode:string,
    courseCode:string
  }
  