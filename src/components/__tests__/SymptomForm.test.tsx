import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SymptomForm from '../SymptomForm'
import type { SymptomEntry } from '../../types/entry.data'

describe('SymptomForm', () => {
  const mockOnAdd = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form with all input fields', () => {
    render(<SymptomForm onAdd={mockOnAdd} />)

    expect(screen.getByText('Add New Entry')).toBeInTheDocument()
    expect(screen.getByText('Record your symptoms and daily habits')).toBeInTheDocument()
    
    // Check for all form fields
    expect(screen.getByLabelText(/Date & Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Symptoms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sleep Hours/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Diet Quality/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Exercise Minutes/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Medications/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Entry/i })).toBeInTheDocument()
  })

  it('should have correct default values', () => {
    render(<SymptomForm onAdd={mockOnAdd} />)

    const sleepInput = screen.getByLabelText(/Sleep Hours/i)
    const exerciseInput = screen.getByLabelText(/Exercise Minutes/i)
    const medicationsInput = screen.getByLabelText(/Medications/i)

    expect(sleepInput).toHaveValue('8')
    expect(exerciseInput).toHaveValue('0')
    expect(medicationsInput).toHaveValue('')
  })

  it('should open and close symptom dropdown', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    
    // Click to open dropdown
    await user.click(searchInput)
    expect(screen.getByText('All Categories')).toBeInTheDocument()

    // Click outside to close dropdown
    await user.click(document.body)
    await waitFor(() => {
      expect(screen.queryByText('All Categories')).not.toBeInTheDocument()
    })
  })

  it('should filter symptoms by search term', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    
    await user.click(searchInput)
    await user.type(searchInput, 'headache')

    expect(screen.getByText('Headache')).toBeInTheDocument()
    expect(screen.queryByText('Fatigue')).not.toBeInTheDocument()
  })

  it('should filter symptoms by category', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    
    await user.click(searchInput)
    
    // Click on Physical category
    const physicalCategory = screen.getByText('Physical')
    await user.click(physicalCategory)

    expect(screen.getByText('Headache')).toBeInTheDocument()
    expect(screen.getByText('Fatigue')).toBeInTheDocument()
    expect(screen.queryByText('Anxiety')).not.toBeInTheDocument()
  })

  it('should select and deselect symptoms', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    
    await user.click(searchInput)
    await user.type(searchInput, 'headache')
    
    const headacheOption = screen.getByText('Headache')
    await user.click(headacheOption)

    // Should show selected symptom
    expect(screen.getByText('Selected Symptoms (1)')).toBeInTheDocument()
    expect(screen.getByText('Headache')).toBeInTheDocument()

    // Should close dropdown and clear search
    expect(screen.queryByText('All Categories')).not.toBeInTheDocument()
    expect(searchInput).toHaveValue('')
  })

  it('should clear all selected symptoms', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    
    // Select multiple symptoms
    await user.click(searchInput)
    await user.type(searchInput, 'headache')
    await user.click(screen.getByText('Headache'))
    
    await user.click(searchInput)
    await user.type(searchInput, 'fatigue')
    await user.click(screen.getByText('Fatigue'))

    expect(screen.getByText('Selected Symptoms (2)')).toBeInTheDocument()

    // Clear all
    const clearAllBtn = screen.getByText('Clear All')
    await user.click(clearAllBtn)

    expect(screen.queryByText('Selected Symptoms (2)')).not.toBeInTheDocument()
  })

  it('should update form fields correctly', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const sleepInput = screen.getByLabelText(/Sleep Hours/i)
    const exerciseInput = screen.getByLabelText(/Exercise Minutes/i)
    const medicationsInput = screen.getByLabelText(/Medications/i)

    await user.clear(sleepInput)
    await user.type(sleepInput, '7.5')

    await user.clear(exerciseInput)
    await user.type(exerciseInput, '45')

    await user.type(medicationsInput, 'ibuprofen, vitamin D')

    expect(sleepInput).toHaveValue('7.5')
    expect(exerciseInput).toHaveValue('45')
    expect(medicationsInput).toHaveValue('ibuprofen, vitamin D')
  })

  it('should update diet quality slider', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const dietSlider = screen.getByRole('slider')
    const dietValue = screen.getByText('3')

    expect(dietValue).toHaveTextContent('3')
    expect(screen.getByText('Good')).toBeInTheDocument()

    // Change slider value
    await user.type(dietSlider, '{arrowright}{arrowright}')

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
  })

  it('should submit form with correct data', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    // Fill out form
    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    await user.click(searchInput)
    await user.type(searchInput, 'headache')
    await user.click(screen.getByText('Headache'))

    const sleepInput = screen.getByLabelText(/Sleep Hours/i)
    await user.clear(sleepInput)
    await user.type(sleepInput, '8')

    const exerciseInput = screen.getByLabelText(/Exercise Minutes/i)
    await user.clear(exerciseInput)
    await user.type(exerciseInput, '30')

    const medicationsInput = screen.getByLabelText(/Medications/i)
    await user.type(medicationsInput, 'ibuprofen, vitamin D')

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
    await user.click(submitBtn)

    expect(mockOnAdd).toHaveBeenCalledTimes(1)
    
    const submittedData = mockOnAdd.mock.calls[0][0] as SymptomEntry
    expect(submittedData).toMatchObject({
      id: 'test-uuid-123', // Mocked UUID
      symptoms: ['headache'],
      sleepHours: 8,
      dietQuality: 3,
      exerciseMinutes: 30,
      medications: ['ibuprofen', 'vitamin D']
    })
    expect(submittedData.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it('should reset form after submission', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    // Fill out and submit form
    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    await user.click(searchInput)
    await user.type(searchInput, 'headache')
    await user.click(screen.getByText('Headache'))

    const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
    await user.click(submitBtn)

    // Form should be reset
    expect(screen.queryByText('Selected Symptoms (1)')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Sleep Hours/i)).toHaveValue('8')
    expect(screen.getByLabelText(/Exercise Minutes/i)).toHaveValue('0')
    expect(screen.getByLabelText(/Medications/i)).toHaveValue('')
  })

  it('should handle empty medications correctly', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
    await user.click(submitBtn)

    const submittedData = mockOnAdd.mock.calls[0][0] as SymptomEntry
    expect(submittedData.medications).toEqual([])
  })

  it('should handle numeric input edge cases', async () => {
    const user = userEvent.setup()
    render(<SymptomForm onAdd={mockOnAdd} />)

    const sleepInput = screen.getByLabelText(/Sleep Hours/i)
    const exerciseInput = screen.getByLabelText(/Exercise Minutes/i)

    // Test with empty values
    await user.clear(sleepInput)
    await user.clear(exerciseInput)

    const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
    await user.click(submitBtn)

    const submittedData = mockOnAdd.mock.calls[0][0] as SymptomEntry
    expect(submittedData.sleepHours).toBe(0)
    expect(submittedData.exerciseMinutes).toBe(0)
  })

  it('should display correct diet quality labels', () => {
    render(<SymptomForm onAdd={mockOnAdd} />)

    // Test all diet quality levels
    const dietSlider = screen.getByRole('slider')
    
    // Default value (3)
    expect(screen.getByText('Good')).toBeInTheDocument()

    // Test other values by changing slider
    fireEvent.change(dietSlider, { target: { value: '1' } })
    expect(screen.getByText('Poor')).toBeInTheDocument()

    fireEvent.change(dietSlider, { target: { value: '2' } })
    expect(screen.getByText('Fair')).toBeInTheDocument()

    fireEvent.change(dietSlider, { target: { value: '4' } })
    expect(screen.getByText('Very Good')).toBeInTheDocument()

    fireEvent.change(dietSlider, { target: { value: '5' } })
    expect(screen.getByText('Excellent')).toBeInTheDocument()
  })
})
