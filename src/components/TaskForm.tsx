import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { validateTitle } from '../taskLogic'
import type { TaskDraft } from '../types'

interface TaskFormProps {
  /** Makes field ids unique when several forms are on the page. */
  idPrefix: string
  submitLabel: string
  /** Accessible name for the form, useful when the visible context is only a list row. */
  formLabel?: string
  /** Values to start from (editing). Omit for an empty form (adding). */
  initialValues?: TaskDraft
  /** Move keyboard focus to the title field when the form appears. */
  autoFocus?: boolean
  onSubmit: (draft: TaskDraft) => void
  /** When given, a Cancel button is shown and Escape also cancels. */
  onCancel?: () => void
}

export function TaskForm({
  idPrefix,
  submitLabel,
  formLabel,
  initialValues,
  autoFocus = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  const titleId = `${idPrefix}-title`
  const descriptionId = `${idPrefix}-description`
  const errorId = `${idPrefix}-title-error`

  useEffect(() => {
    if (autoFocus) titleRef.current?.focus()
  }, [autoFocus])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const message = validateTitle(title)
    if (message) {
      setError(message)
      titleRef.current?.focus()
      return
    }
    onSubmit({ title, description })
    setTitle(initialValues?.title ?? '')
    setDescription(initialValues?.description ?? '')
    setError(null)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && onCancel) {
      event.stopPropagation()
      onCancel()
    }
  }

  return (
    <form
      className="task-form"
      aria-label={formLabel}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <div className="field">
        <label htmlFor={titleId}>Title</label>
        <input
          ref={titleRef}
          id={titleId}
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setError(null)
          }}
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
        />
        {error && (
          <p id={errorId} className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={descriptionId}>Description (optional)</label>
        <textarea
          id={descriptionId}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
