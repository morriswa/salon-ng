
export interface UserInfo {
  firstName: string,
  lastName: string,
  pronouns: string,
  formattedAddress: string,
  phoneNumber: string,
  email: string,
  contactPreference: string,
}

export interface ClientInfo extends UserInfo {
  birthday?: string,
}

export interface EmployeeInfo extends UserInfo {
  bio?: string,
}

export interface EmployeeProfile extends EmployeeInfo {
  profileImage: string,
  employeeId: number,
}
