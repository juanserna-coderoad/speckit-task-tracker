import { useEffect, useId, useRef } from 'react'
import type { Task, TaskDraft } from '../types'
import { TaskForm } from './TaskForm'

interface TaskItemProps {
  task: Task
  isEditing: boolean
  onToggle: (id: string) => void
  onStartEdit: (id: string) => void
  onSave: (id: string, draft: TaskDraft) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function TaskItem({
  task,
  isEditing,
  onToggle,
  onStartEdit,
  onSave,
  onCancelEdit,
  onDelete,
}: TaskItemProps) {
  const uid = useId()
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`
  const editButtonRef = useRef<HTMLButtonElement>(null)
  // Set when the user closes the form here, so focus returns to Edit and keyboard users keep their place.
  const restoreFocusRef = useRef(false)

  useEffect(() => {
    if (!isEditing && restoreFocusRef.current) {
      restoreFocusRef.current = false
      editButtonRef.current?.focus()
    }
  }, [isEditing])

  function handleSave(draft: TaskDraft) {
    restoreFocusRef.current = true
    onSave(task.id, draft)
  }

  function handleCancel() {
    restoreFocusRef.current = true
    onCancelEdit()
  }

  const deleteButton = (
    <button
      type="button"
      className="danger"
      aria-label={`Delete task: ${task.title}`}
      onClick={() => onDelete(task.id)}
    >
      Delete
    </button>
  )

  if (isEditing) {
    return (
      <li className="task-item">
        <TaskForm
          idPrefix={`${uid}-edit`}
          formLabel={`Edit task: ${task.title}`}
          submitLabel="Save"
          initialValues={{ title: task.title, description: task.description }}
          autoFocus
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
        <div className="task-actions edit-extras">{deleteButton}</div>
      </li>
    )
  }

  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <div className="task-row">
        <label className="task-toggle">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-labelledby={titleId}
            aria-describedby={task.description ? descriptionId : undefined}
          />
          <span className="task-text">
            <span id={titleId} className="task-title">
              {task.title}
            </span>
            {task.description && (
              <span id={descriptionId} className="task-description">
                {task.description}
              </span>
            )}
          </span>
        </label>
        <div className="task-actions">
          <button
            ref={editButtonRef}
            type="button"
            aria-label={`Edit task: ${task.title}`}
            onClick={() => onStartEdit(task.id)}
          >
            Edit
          </button>
          {deleteButton}
        </div>
      </div>
    </li>
  )
}
