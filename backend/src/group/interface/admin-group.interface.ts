export interface AdminGroup {
  id: number
  group_name: string
  private: boolean
  invitation_code?: string
  description: string
  create_time?: Date
  update_time?: Date
  UserGroup: number
  ManagerGroup?: string[]
}
