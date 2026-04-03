import { supabase } from './supabaseClient';

export const saveQuizResult = async (userId: string, topic: string, score: number, totalQuestions: number) => {
  try {
    const { error } = await supabase
      .from('assessment_results')
      .insert([
        { 
          user_id: userId, 
          topic: topic, 
          score: score, 
          total_questions: totalQuestions,
          feedback: score >= 4 ? 'Excellent' : score >= 3 ? 'Good' : 'Needs Improvement'
        }
      ]);

    if (error) throw error;
    console.log("Quiz result saved successfully");
    return true;
  } catch (err) {
    console.error("Error saving quiz result:", err);
    return false;
  }
};

export const getQuizHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching quiz history:", err);
    return [];
  }
};
