export interface Schedules {
  email:string,
  username:string,
  schedules:Array<{
    scheduleName:string,
    status:string,
    description:string,
    lastModified:string,
    codes:Array<{
      subjectCode:string,
      courseCode:string
      }>
    }>
  }
  export interface Schedule {
      scheduleName:string,
      status:string,
      description:string,
      lastModified:string,
      codes:Array<{
        subjectCode:string,
        courseCode:string
        }>
    }
export interface UpdateSchedule {
    subjectCode:string,
    courseCode:string
  }
export interface PublicSchedule {
  username:string,
  scheduleName:string,
  codes:Array<{
    subjectCode:string,
    courseCode:string
    }>
  }