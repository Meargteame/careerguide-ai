import { supabase } from './supabaseClient';
import { DetailedRoadmap } from '../types';

export interface SavedRoadmap {
  id: string;
  title: string;
  role: string;
  road_data: DetailedRoadmap;
  created_at: string;
}

export const saveRoadmap = async (roadmap: DetailedRoadmap, userId: string): Promise<SavedRoadmap | null> => {
  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .insert([
        {
          title: roadmap.title,
          role: roadmap.role,
          road_data: roadmap, // Storing the full JSON structure
          user_id: userId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving roadmap:', error);
      alert('Database Error saving roadmap: ' + error.message);
      return null;
    }

    return data as SavedRoadmap;
  } catch (err) {
    console.error('Unexpected error saving roadmap:', err);
    return null;
  }
};

export const getUserRoadmaps = async (userId: string): Promise<SavedRoadmap[]> => {
  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching roadmaps:', error);
      return [];
    }
    
    return data as SavedRoadmap[];
  } catch (err) {
    console.error('Unexpected error fetching roadmaps:', err);
    return [];
  }
};

export const deleteRoadmap = async (roadmapId: string) => {
  const { error } = await supabase
    .from('roadmaps')
    .delete()
    .eq('id', roadmapId);
    
  if (error) throw error;
};
