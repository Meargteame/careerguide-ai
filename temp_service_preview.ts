export const checkAndAwardAchievements = async (userId: string) => {
  try {
    const stats = await getStudentStats(userId);
    const { data: profile, error } = await supabase.from('profiles').select('achievements, xp, meridian_coins').eq('id', userId).single();
    if (error || !profile) return;
    
    let currentBadges = profile.achievements || [];
    let badgeIds = currentBadges.map((b: any) => b.id);
    let newBadges: any[] = [];
    let bonusXp = 0;
    let bonusCoins = 0;
--
export const trackDailyActivity = async (userId: string) => {
  try {
    const { data: profile } = await supabase.from('profiles').select('last_active_date, streak').eq('id', userId).single();
    if (!profile) return 0;

    const todayObj = new Date();
    const today = todayObj.toISOString().split('T')[0];
    const lastActive = profile.last_active_date;
    let newStreak = profile.streak || 0;
    
    if (lastActive === today) return newStreak; // Already tracked today
--
export const createCourseFromRoadmap = async (role: string, userId: string): Promise<Course | null> => {
  try {
    // 1. Generate Course Content via AI
    const apiCourse = await generateCourseDetails(role);
    if (!apiCourse) return null;

    // 2. Add metadata
    const newCourse: Course = {
      ...apiCourse,
      id: crypto.randomUUID(), // This will be overwritten by Supabase if auto-gen, but useful for optimistic UI
      author: 'AI Architect',
--
export const enrollInCourse = async (courseId: string, userId: string) => {
  const { error } = await supabase
    .from('course_enrollments')
    .upsert([{ 
      course_id: courseId, 
      user_id: userId,
      progress: 0,
      completed_lessons: []
    }], { onConflict: 'user_id,course_id', ignoreDuplicates: true });
    
  if (error) throw error;
--
export const completeLesson = async (courseId: string, userId: string, lessonId: string) => {
  try {
    const { data: enrollment, error: fetchError } = await supabase
      .from('course_enrollments')
      .select('completed_lessons, progress')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

--
export const getUserCourses = async (userId: string) => {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select(`
      progress,
      completed_lessons,
      course_id,
      courses (*)
    `)
    .eq('user_id', userId);

--
export const getStudentStats = async (userId: string) => {
  try {
     const { data: enrollments, count } = await supabase
       .from('course_enrollments')
       .select('*', { count: 'exact' })
       .eq('user_id', userId);

     const { data: profile } = await supabase
       .from('profiles')
       .select('xp, streak, meridian_coins, achievements, daily_bounties_state, last_active_date')
       .eq('id', userId)
--
export const getRecentActivity = async (userId: string) => {
   try {
      // Fetch recent enrollments
      const { data } = await supabase
        .from('course_enrollments')
        .select(`
           enrolled_at,
           courses (title, category)
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false })
