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
    
    // Distribute XP and coins based on score
    const xpReward = score * 50;
    const coinsReward = score * 5;
    if (xpReward > 0 || coinsReward > 0) {
      await awardStatsFields(userId, xpReward, coinsReward);
    }
    
    return true;
  } catch (err) {
    console.error("Error saving quiz result:", err);
    return false;
  }
};

const awardStatsFields = async (userId: string, xpToAdd: number, coinsToAdd: number) => {
  try {
    const { data: profile } = await supabase
       .from('profiles')
       .select('xp, meridian_coins')
       .eq('id', userId)
       .single();
       
    const newXp = (profile?.xp || 0) + xpToAdd;
    const newCoins = (profile?.meridian_coins || 0) + coinsToAdd;
    
    await supabase.from('profiles').update({ xp: newXp, meridian_coins: newCoins }).eq('id', userId);
  } catch (err) {
      console.error("Failed to update profile stats", err);
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
