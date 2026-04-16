import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Consultation {
  id: number
  consultant_name: string
  session_type: string
  booked_date: string
  booked_slot: string
  status: string
  created_at: string
}

interface ConsultationState {
  consultations: Consultation[]
  loading: boolean
  error: string | null
}

const initialState: ConsultationState = {
  consultations: [],
  loading: false,
  error: null,
}

const consultationSlice = createSlice({
  name: "consultations",
  initialState,
  reducers: {
    setConsultationsLoading(state) {
      state.loading = true
      state.error = null
    },
    setConsultations(state, action: PayloadAction<Consultation[]>) {
      state.consultations = action.payload
      state.loading = false
    },
    addConsultation(state, action: PayloadAction<Consultation>) {
      state.consultations.unshift(action.payload)
    },
    setConsultationsError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setConsultationsLoading,
  setConsultations,
  addConsultation,
  setConsultationsError,
} = consultationSlice.actions
export default consultationSlice.reducer
