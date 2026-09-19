/**
 * Skill & Role Categorization Utilities
 * Intelligently maps skills, roles, and disciplines into high-level categories
 * for campus talent discovery and filtering.
 */

const AI_REGEX = /\b(ai|ml|machine\s+learning|deep\s+learning|pytorch|tensorflow|keras|nlp|vision|computer\s+vision|opencv|llm|llms|rag|langchain|langgraph|llama|gpt|openai|data\s+science|scikit|scikit-learn|pandas|numpy|neural|analytics|data\s+analysis|big\s+data|reinforcement\s+learning|genai|gen-ai|generative\s+ai|agentic)\b/i;
const DESIGN_REGEX = /\b(figma|ui|ux|ui\/ux|design|designer|wireframing|prototyping|photoshop|illustrator|blender|3d|graphic|graphics|visual|product\s+design|interaction|framer|canva|typography|user\s+research|design\s+systems)\b/i;
const VIDEO_REGEX = /\b(video|videography|video\s+editing|premiere|premiere\s+pro|after\s+effects|davinci|resolve|final\s+cut|animation|motion|motion\s+design|vfx|cinematography|sound\s+design|audio)\b/i;
const CONTENT_REGEX = /\b(content|content\s+writing|copywriting|technical\s+writing|copy|seo|marketing|blog|blogging|documentation|technical\s+writer|storytelling|journalism|community|social\s+media)\b/i;

export function inferSkillCategory(rawName: string): string {
  if (!rawName) return 'Development';
  const trimmed = rawName.trim();

  // 1. Check specific regex patterns with word boundaries
  if (AI_REGEX.test(trimmed)) return 'AI/ML';
  if (VIDEO_REGEX.test(trimmed)) return 'Video';
  if (DESIGN_REGEX.test(trimmed)) return 'Design';
  if (CONTENT_REGEX.test(trimmed)) return 'Content';

  // Default: Development (web, mobile, cloud, backend, systems, languages)
  return 'Development';
}

/**
 * Checks if a student matches a selected category filter.
 * Evaluates primary role, skill categories, individual skill names, major, and project proofs.
 */
export function matchesStudentCategory(student: any, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === 'All') return true;
  const target = selectedCategory.toLowerCase().trim();

  // 1. Check primaryRole
  const primaryRole = (student.primaryRole || '').toLowerCase().trim();
  if (primaryRole.includes(target)) return true;
  if (inferSkillCategory(primaryRole).toLowerCase() === target) return true;

  if (target === 'development') {
    if (/\b(developer|dev|engineer|software|coder|programmer|frontend|backend|fullstack|full-stack|web|mobile|cloud|devops|systems|blockchain|web3)\b/i.test(primaryRole)) {
      return true;
    }
  }

  // 2. Check major
  const major = (student.major || '').toLowerCase().trim();
  if (major.includes(target)) return true;
  if (target === 'development' && /\b(computer|engineering|information|tech|software|cs|it)\b/i.test(major)) {
    return true;
  }
  if (target === 'design' && /\b(design|media|art|graphics|ux|ui)\b/i.test(major)) {
    return true;
  }
  if (target === 'ai/ml' && /\b(ai|data|intelligence|analytics|machine\s+learning)\b/i.test(major)) {
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

  // 4. Check project proofs
  const proofs = Array.isArray(student.proofs) ? student.proofs : [];
  for (const p of proofs) {
    const techs = Array.isArray(p.technologies) ? p.technologies : [];
    for (const t of techs) {
      if (inferSkillCategory(t).toLowerCase() === target) return true;
    }
  }

  return false;
}
