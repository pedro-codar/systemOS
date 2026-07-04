export type Skill = {
  id: string;
  name: string;
  trigger: string;
  prompt: string;
  createdAt: string;
};

export type NewSkillData = {
  name: string;
  trigger: string;
  prompt: string;
};
