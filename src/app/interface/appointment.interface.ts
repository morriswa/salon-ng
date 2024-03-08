
export interface Appointment {
  appointmentId:number,
  time:string,
  length:number,
  dateCreated:string,
  paymentDueDate:string,
  cost:string,
  tipAmount?:string,
  status:string,
  serviceId:number,
  serviceName:string,
  employee?:UserInfo,
  client?:UserInfo
}

interface UserInfo {
  userId:number,
  firstName:string,
  lastName:string,
  phoneNumber:string,
  email:string,
  contactPreference:string
}
