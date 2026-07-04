export type KnowledgeInformation = {
  id: string;
  title: string;
  description: string;
};

export type KnowledgeCardData = {
  id: string;
  title: string;
  description: string;
  informations: KnowledgeInformation[];
};

export type NewCategoryData = {
  title: string;
  description: string;
};

export type NewInformationData = {
  title: string;
  description: string;
};

export function getCategoryItemCount(category: KnowledgeCardData) {
  return category.informations.length;
}
