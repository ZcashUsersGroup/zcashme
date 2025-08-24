import { supabase } from './supabase.js'

export const getTotalCount = async () => {
  const { count } = await supabase
    .from('zcasher')
    .select('*', { count: 'exact', head: true })
  return count
}

export const getRandomZcasher = async (count) => {
  const randomOffset = Math.floor(Math.random() * count)
  console.log(randomOffset)
  
  const { data, error } = await supabase
    .from('zcasher')
    .select('*')
    .range(randomOffset, randomOffset)
    .limit(1)
  
  if (error) {
    console.error('Error fetching random zcasher:', error)
    return null
  }
  
  return data?.[0] || null
}