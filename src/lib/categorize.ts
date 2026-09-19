/**
 * Skill & Role Categorization Utilities
 * Intelligently maps skills, roles, and disciplines into high-level categories
 * for campus talent discovery and filtering.
 */

export function inferSkillCategory(rawName: string): string {
  if (!rawName) return 'Development';
  const lower = rawName.toLowerCase().trim();

  // Design
  if (
    lower.includes('figma') ||
    lower.includes('ui') ||
    lower.includes('ux') ||
    lower.includes('design') ||
    lower.includes('wirefram') ||
    lower.includes('prototyp') ||
    lower.includes('photoshop') ||
    lower.includes('illustrator') ||
    lower.includes('blender') ||
    lower.includes('3d') ||
    lower.includes('graphic') ||
    lower.includes('visual') ||
    lower.includes('product design')
  ) {
    return 'Design';
  }

  // AI / ML / Data
  if (
    lower.includes('ai') ||
    lower.includes('ml') ||
    lower.includes('machine learning') ||
    lower.includes('deep learning') ||
    lower.includes('pytorch') ||
    lower.includes('tensorflow') ||
    lower.includes('nlp') ||
    lower.includes('vision') ||
    lower.includes('opencv') ||
    lower.includes('llm') ||
    lower.includes('langchain') ||
    lower.includes('data science') ||
    lower.includes('scikit') ||
    lower.includes('neural') ||
    lower.includes('analytics')
  ) {
    return 'AI/ML';
  }

  // Video & Motion
  if (
    lower.includes('video') ||
    lower.includes('premiere') ||
    lower.includes('after effects') ||
    lower.includes('davinci') ||
    lower.includes('final cut') ||
    lower.includes('animation') ||
    lower.includes('motion') ||
    lower.includes('editing') ||
    lower.includes('vfx')
  ) {
    return 'Video';
  }

  // Content & Marketing
  if (
    lower.includes('content') ||
    lower.includes('writing') ||
    lower.includes('copywriting') ||
    lower.includes('seo') ||
    lower.includes('marketing') ||
    lower.includes('blog') ||
    lower.includes('documentation') ||
    lower.includes('technical writing') ||
    lower.includes('community')
  ) {
    return 'Content';
  }

  // Default: Development (web, mobile, cloud, backend, systems)
  return 'Development';
}

/**
 * Checks if a student matches a selected category filter.
 * Evaluates skill categories, individual skill names, primary role, and major.
 */
export function matchesStudentCategory(student: any, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === 'All') return true;
  const target = selectedCategory.toLowerCase().trim();

  // 1. Check primaryRole
  const primaryRole = (student.primaryRole || '').toLowerCase();
  if (primaryRole.includes(target)) return true;
  if (inferSkillCategory(primaryRole).toLowerCase() === target) return true;

  // 2. Check major
  const major = (student.major || '').toLowerCase();
  if (major.includes(target)) return true;
  if (target === 'development' && (major.includes('computer') || major.includes('engineering') || major.includes('information'))) {
    return true;
  }
  if (target === 'design' && (major.includes('design') || major.includes('media') || major.includes('art'))) {
    return true;
  }

  // 3. Check skills
  const skills = Array.isArray(student.skills) ? student.skills : [];
  for (const sk of skills) {
    const skillName = typeof sk === 'string' ? sk : sk?.name || '';
    const skillCat = typeof sk === 'object' && sk?.category ? sk.category : '';

    if (skillCat && skillCat.toLowerCase() === target) return true;
    if (inferSkillCategory(skillName).toLowerCase() === target) return true;
    if (skillName.toLowerCase().includes(target)) return true;
  }

  return false;
}
