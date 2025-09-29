import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ApartmentData = {
  id?: string
  title: string
  price: string
  address: string
  meters: string
  rooms: string
  bathrooms: string
  floor: string
  description: string
  features: string
  photos: string[]
  updated_at?: string
}

export type Contact = {
  id?: string
  name: string
  email: string
  phone: string
  message: string
  created_at?: string
}