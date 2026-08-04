import { reactive } from 'vue'

let _nextId = 200
function uid() { return `dept-${_nextId++}` }

export const departments = reactive([
  {
    id: 'ca-nhan', label: 'Cá nhân', fixed: true, expanded: true,
    _editing: false, _editVal: '',
    projects: [
      { id: 'cv-ca-nhan', label: 'Công việc cá nhân', fixed: true,  color: '#3b82f6', _editing: false, _editVal: '' },
    ],
  },
  {
    id: 'khoi-qt', label: 'Khối QT NS ĐH', fixed: false, expanded: false,
    _editing: false, _editVal: '',
    projects: [
      { id: 'proj-qt-1', label: 'Quản lý nhân sự', fixed: false, color: '#8b5cf6', _editing: false, _editVal: '' },
      { id: 'proj-qt-2', label: 'Tuyển dụng 2024', fixed: false, color: '#ec4899', _editing: false, _editVal: '' },
    ],
  },
  {
    id: 'amis-mt', label: 'AMIS Mục Tiêu', fixed: false, expanded: false,
    _editing: false, _editVal: '',
    projects: [
      { id: 'proj-mt-1', label: 'Mục tiêu Q3', fixed: false, color: '#f97316', _editing: false, _editVal: '' },
      { id: 'proj-mt-2', label: 'KPI 2024',     fixed: false, color: '#10b981', _editing: false, _editVal: '' },
    ],
  },
])

export function addDepartment() {
  const d = {
    id: uid(), label: 'Phòng ban mới', fixed: false, expanded: true,
    _editing: true, _editVal: 'Phòng ban mới',
    projects: [],
  }
  departments.push(d)
}

export function deleteDepartment(dept) {
  const i = departments.findIndex(d => d.id === dept.id)
  if (i >= 0) departments.splice(i, 1)
}

export function addProject(dept) {
  const p = { id: uid(), label: 'Nhóm/Dự án mới', fixed: false, color: '#10b981', _editing: true, _editVal: 'Nhóm/Dự án mới' }
  dept.projects.push(p)
  dept.expanded = true
}

export function deleteProject(dept, proj) {
  const i = dept.projects.findIndex(p => p.id === proj.id)
  if (i >= 0) dept.projects.splice(i, 1)
}
