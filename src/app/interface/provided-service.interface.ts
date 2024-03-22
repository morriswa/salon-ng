export interface ProvidedService {
  serviceId?: number,
  name?: string,
  length?: number,
  cost?:number
}

export interface ProvidedServiceDetails extends ProvidedService {
  employee: {
    employeeId:number,
    firstName:string,
    lastName:string,
    pronouns:string,
    phoneNumber:string,
    email:string,
    contactPreference:string
  }
}

export interface ProvidedServiceProfile extends ProvidedServiceDetails {
  content: string[]
}
