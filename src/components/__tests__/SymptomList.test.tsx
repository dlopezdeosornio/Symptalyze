import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SymptomList from '../SymptomList'
import type { SymptomEntry } from '../../types/entry.data'

describe('SymptomList', () => {
  const mockEntries: SymptomEntry[] = [
    {
      id: '1',
      date: '2024-01-01T00:00:00.000Z',
      symptoms: ['headache', 'fatigue'],
      sleepHours: 8,
      dietQuality: 4,
      exerciseMinutes: 30,
      medications: ['ibuprofen']
    },
    {
      id: '2',
      date: '2024-01-02T00:00:00.000Z',
      symptoms: ['dizziness'],
      sleepHours: 6,
      dietQuality: 2,
      exerciseMinutes: 0,
      medications: []
    }
  ]

  beforeEach(() => {
    // Mock Date.now() to ensure consistent date formatting
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-03T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render empty state when no entries', () => {
    render(<SymptomList entries={[]} />)

    expect(screen.getByText('No entries yet')).toBeInTheDocument()
    expect(screen.getByText('Start tracking your symptoms and daily habits to see them here!')).toBeInTheDocument()
    expect(screen.getByText('📝')).toBeInTheDocument()
  })

  it('should render entries list with correct count', () => {
    render(<SymptomList entries={mockEntries} />)

    expect(screen.getByText('Your Health Journal')).toBeInTheDocument()
    expect(screen.getByText('2 entries recorded')).toBeInTheDocument()
  })

  it('should display single entry count correctly', () => {
    render(<SymptomList entries={[mockEntries[0]]} />)

    expect(screen.getByText('1 entry recorded')).toBeInTheDocument()
  })

  it('should sort entries by date (newest first)', () => {
    render(<SymptomList entries={mockEntries} />)

    const entryDates = screen.getAllByText(/Today|Yesterday|Jan \d+/)
    // Should be sorted with newest first
    expect(entryDates[0]).toHaveTextContent('Yesterday') // 2024-01-02
    expect(entryDates[1]).toHaveTextContent('Jan 1') // 2024-01-01
  })

  it('should display entry summary information', () => {
    render(<SymptomList entries={[mockEntries[0]]} />)

    expect(screen.getByText('headache')).toBeInTheDocument()
    expect(screen.getByText('fatigue')).toBeInTheDocument()
    expect(screen.getByText('8h')).toBeInTheDocument()
    expect(screen.getByText('4/5')).toBeInTheDocument()
    expect(screen.getByText('30min')).toBeInTheDocument()
  })

  it('should handle single symptom correctly', () => {
    render(<SymptomList entries={[mockEntries[1]]} />)

    expect(screen.getByText('dizziness')).toBeInTheDocument()
    expect(screen.queryByText('+1 more')).not.toBeInTheDocument()
  })

  it('should show "more" indicator for many symptoms', () => {
    const manySymptomsEntry: SymptomEntry = {
      ...mockEntries[0],
      symptoms: ['headache', 'fatigue', 'dizziness', 'nausea', 'fever']
    }

    render(<SymptomList entries={[manySymptomsEntry]} />)

    expect(screen.getByText('headache')).toBeInTheDocument()
    expect(screen.getByText('fatigue')).toBeInTheDocument()
    expect(screen.getByText('dizziness')).toBeInTheDocument()
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('should expand and collapse entries when clicked', async () => {
    const user = userEvent.setup()
    render(<SymptomList entries={[mockEntries[0]]} />)

    const entry = screen.getByText('Jan 1')
    const expandButton = screen.getByText('▼')

    // Initially collapsed
    expect(screen.queryByText('💊 Medications')).not.toBeInTheDocument()

    // Click to expand
    await user.click(entry)

    expect(screen.getByText('💊 Medications')).toBeInTheDocument()
    expect(screen.getByText('ibuprofen')).toBeInTheDocument()
    expect(screen.getByText('😴 Sleep Quality')).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    expect(screen.getByText('🍎 Diet Quality')).toBeInTheDocument()
    expect(screen.getByText('Very Good')).toBeInTheDocument()
    expect(screen.getByText('🏃 Exercise')).toBeInTheDocument()

    // Click to collapse
    await user.click(entry)

    expect(screen.queryByText('💊 Medications')).not.toBeInTheDocument()
  })

  it('should display correct sleep quality labels', () => {
    const sleepTestEntries: SymptomEntry[] = [
      { ...mockEntries[0], sleepHours: 9 }, // Excellent
      { ...mockEntries[0], sleepHours: 7.5, id: '2' }, // Good
      { ...mockEntries[0], sleepHours: 6, id: '3' }, // Fair
      { ...mockEntries[0], sleepHours: 4, id: '4' } // Poor
    ]

    render(<SymptomList entries={sleepTestEntries} />)

    // Expand first entry
    fireEvent.click(screen.getByText('Jan 1'))
    expect(screen.getByText('Excellent')).toBeInTheDocument()
  })

  it('should display correct diet quality labels', () => {
    const dietTestEntries: SymptomEntry[] = [
      { ...mockEntries[0], dietQuality: 1, id: '1' }, // Poor
      { ...mockEntries[0], dietQuality: 2, id: '2' }, // Fair
      { ...mockEntries[0], dietQuality: 3, id: '3' }, // Good
      { ...mockEntries[0], dietQuality: 4, id: '4' }, // Very Good
      { ...mockEntries[0], dietQuality: 5, id: '5' } // Excellent
    ]

    render(<SymptomList entries={dietTestEntries} />)

    // Expand first entry
    fireEvent.click(screen.getByText('Jan 1'))
    expect(screen.getByText('Poor')).toBeInTheDocument()
  })

  it('should handle empty medications array', () => {
    render(<SymptomList entries={[mockEntries[1]]} />)

    // Expand entry
    fireEvent.click(screen.getByText('Yesterday'))

    expect(screen.getByText('None recorded')).toBeInTheDocument()
  })

  it('should display exercise progress bar', () => {
    render(<SymptomList entries={[mockEntries[0]]} />)

    // Expand entry
    fireEvent.click(screen.getByText('Jan 1'))

    const progressBar = screen.getByRole('progressbar', { hidden: true })
    expect(progressBar).toBeInTheDocument()
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
  })

  it('should format dates correctly', () => {
    const today = new Date('2024-01-03T12:00:00.000Z')
    const yesterday = new Date('2024-01-02T12:00:00.000Z')
    const older = new Date('2023-12-15T12:00:00.000Z')

    const dateTestEntries: SymptomEntry[] = [
      { ...mockEntries[0], date: today.toISOString(), id: '1' },
      { ...mockEntries[0], date: yesterday.toISOString(), id: '2' },
      { ...mockEntries[0], date: older.toISOString(), id: '3' }
    ]

    render(<SymptomList entries={dateTestEntries} />)

    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
    expect(screen.getByText('Dec 15, 2023')).toBeInTheDocument()
  })

  it('should display time correctly', () => {
    render(<SymptomList entries={[mockEntries[0]]} />)

    // Should show time in 12-hour format
    expect(screen.getByText('12:00 AM')).toBeInTheDocument()
  })

  it('should handle string symptoms (legacy format)', () => {
    const stringSymptomEntry: SymptomEntry = {
      ...mockEntries[0],
      symptoms: 'headache' as any
    }

    render(<SymptomList entries={[stringSymptomEntry]} />)

    expect(screen.getByText('headache')).toBeInTheDocument()
    expect(screen.queryByText('+1 more')).not.toBeInTheDocument()
  })

  it('should only allow one entry to be expanded at a time', async () => {
    const user = userEvent.setup()
    render(<SymptomList entries={mockEntries} />)

    const firstEntry = screen.getByText('Yesterday')
    const secondEntry = screen.getByText('Jan 1')

    // Expand first entry
    await user.click(firstEntry)
    expect(screen.getByText('💊 Medications')).toBeInTheDocument()

    // Expand second entry
    await user.click(secondEntry)
    
    // First entry should be collapsed, second should be expanded
    expect(screen.queryByText('💊 Medications')).not.toBeInTheDocument()
    expect(screen.getByText('ibuprofen')).toBeInTheDocument()
  })

  it('should toggle expansion when clicking same entry', async () => {
    const user = userEvent.setup()
    render(<SymptomList entries={[mockEntries[0]]} />)

    const entry = screen.getByText('Jan 1')

    // Expand
    await user.click(entry)
    expect(screen.getByText('💊 Medications')).toBeInTheDocument()

    // Collapse
    await user.click(entry)
    expect(screen.queryByText('💊 Medications')).not.toBeInTheDocument()
  })
})
