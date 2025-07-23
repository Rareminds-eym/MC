import React from 'react';
import { Category, Term } from '../../../types/Level2/types';
import CategoryBox from '../CategoryBox';

interface CategoryGridProps {
  categories: Category[];
  getTermsInCategory: (categoryId: string) => Term[];
  correctTerms: Set<string>;
  incorrectTerms: Set<string>;
  isMobile: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  getTermsInCategory,
  correctTerms,
  incorrectTerms,
  isMobile,
}) => {
  if (isMobile) {
    return (
      <div className="flex-1 grid grid-cols-2 gap-1">
        {categories.map((category) => (
          <div key={category.id} className="min-h-0">
            <CategoryBox
              category={category}
              terms={getTermsInCategory(category.id)}
              showResults={false}
              correctTerms={correctTerms}
              incorrectTerms={incorrectTerms}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 flex gap-3 min-h-0">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="animate-slideIn category-box flex-1 md:h-[40em]"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <CategoryBox
            category={category}
            terms={getTermsInCategory(category.id)}
            showResults={false}
            correctTerms={correctTerms}
            incorrectTerms={incorrectTerms}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
